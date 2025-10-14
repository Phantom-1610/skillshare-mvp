import User from '../models/User.js';
import Match from '../models/Match.js';
import Review from '../models/Review.js';

/**
 * Skill Matching Service
 * Implements a deterministic, explainable matching algorithm
 */
class MatchingService {
  /**
   * Find potential matches for a user
   * @param {string} userId - User ID to find matches for
   * @param {string} skill - Specific skill to match on (optional)
   * @returns {Array} Array of match objects with scores and reasons
   */
  async findMatches(userId, skill = null) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get all users except the current user
      const allUsers = await User.find({
        _id: { $ne: userId },
        isActive: true,
        isVerified: true
      }).select('firstName lastName location offeredSkills desiredSkills stats availability preferences');

      const matches = [];

      for (const potentialMatch of allUsers) {
        const matchResult = await this.calculateMatchScore(user, potentialMatch, skill);
        
        if (matchResult.score > 0) {
          matches.push({
            user: potentialMatch,
            score: matchResult.score,
            reasons: matchResult.reasons,
            breakdown: matchResult.breakdown
          });
        }
      }

      // Sort by score descending
      matches.sort((a, b) => b.score - a.score);

      return matches.slice(0, 50); // Return top 50 matches
    } catch (error) {
      console.error('Error finding matches:', error);
      throw error;
    }
  }

  /**
   * Calculate match score between two users
   * @param {Object} user1 - First user
   * @param {Object} user2 - Second user
   * @param {string} specificSkill - Specific skill to match on
   * @returns {Object} Match result with score, reasons, and breakdown
   */
  async calculateMatchScore(user1, user2, specificSkill = null) {
    let totalScore = 0;
    const reasons = [];
    const breakdown = {
      skillMatch: 0,
      levelCompatibility: 0,
      locationProximity: 0,
      availabilityOverlap: 0,
      mutualSkills: 0,
      ratingBonus: 0,
      activityBonus: 0
    };

    // 1. Skill Matching (40% weight)
    const skillMatch = this.calculateSkillMatch(user1, user2, specificSkill);
    breakdown.skillMatch = skillMatch.score;
    totalScore += skillMatch.score * 0.4;
    if (skillMatch.score > 0) {
      reasons.push('skill_match');
      if (skillMatch.reasons.length > 0) {
        reasons.push(...skillMatch.reasons);
      }
    }

    // 2. Level Compatibility (20% weight)
    const levelCompatibility = this.calculateLevelCompatibility(user1, user2, specificSkill);
    breakdown.levelCompatibility = levelCompatibility.score;
    totalScore += levelCompatibility.score * 0.2;
    if (levelCompatibility.score > 0) {
      reasons.push('level_compatibility');
    }

    // 3. Location Proximity (10% weight)
    const locationProximity = this.calculateLocationProximity(user1, user2);
    breakdown.locationProximity = locationProximity.score;
    totalScore += locationProximity.score * 0.1;
    if (locationProximity.score > 0) {
      reasons.push('location_proximity');
    }

    // 4. Availability Overlap (15% weight)
    const availabilityOverlap = this.calculateAvailabilityOverlap(user1, user2);
    breakdown.availabilityOverlap = availabilityOverlap.score;
    totalScore += availabilityOverlap.score * 0.15;
    if (availabilityOverlap.score > 0) {
      reasons.push('availability_overlap');
    }

    // 5. Mutual Skills (10% weight)
    const mutualSkills = this.calculateMutualSkills(user1, user2);
    breakdown.mutualSkills = mutualSkills.score;
    totalScore += mutualSkills.score * 0.1;
    if (mutualSkills.score > 0) {
      reasons.push('mutual_skills');
    }

    // 6. Rating Bonus (3% weight)
    const ratingBonus = this.calculateRatingBonus(user2);
    breakdown.ratingBonus = ratingBonus.score;
    totalScore += ratingBonus.score * 0.03;
    if (ratingBonus.score > 0) {
      reasons.push('high_rating');
    }

    // 7. Activity Bonus (2% weight)
    const activityBonus = this.calculateActivityBonus(user2);
    breakdown.activityBonus = activityBonus.score;
    totalScore += activityBonus.score * 0.02;
    if (activityBonus.score > 0) {
      reasons.push('active_user');
    }

    return {
      score: Math.round(totalScore),
      reasons: [...new Set(reasons)], // Remove duplicates
      breakdown
    };
  }

  /**
   * Calculate skill matching score
   */
  calculateSkillMatch(user1, user2, specificSkill = null) {
    let score = 0;
    const reasons = [];

    if (specificSkill) {
      // Check if user2 offers the specific skill that user1 desires
      const user1Desires = user1.desiredSkills.find(s => s.skill.toLowerCase() === specificSkill.toLowerCase());
      const user2Offers = user2.offeredSkills.find(s => s.skill.toLowerCase() === specificSkill.toLowerCase());

      if (user1Desires && user2Offers) {
        score = 100;
        reasons.push('exact_skill_match');
      }
    } else {
      // Check for any skill matches
      for (const desiredSkill of user1.desiredSkills) {
        const matchingOfferedSkill = user2.offeredSkills.find(
          offered => offered.skill.toLowerCase() === desiredSkill.skill.toLowerCase()
        );

        if (matchingOfferedSkill) {
          score = Math.max(score, 100);
          reasons.push('skill_match');
          break;
        }
      }
    }

    return { score, reasons };
  }

  /**
   * Calculate level compatibility score
   */
  calculateLevelCompatibility(user1, user2, specificSkill = null) {
    let score = 0;

    if (specificSkill) {
      const user1Desires = user1.desiredSkills.find(s => s.skill.toLowerCase() === specificSkill.toLowerCase());
      const user2Offers = user2.offeredSkills.find(s => s.skill.toLowerCase() === specificSkill.toLowerCase());

      if (user1Desires && user2Offers) {
        score = this.getLevelCompatibilityScore(user1Desires.level, user2Offers.level);
      }
    } else {
      // Find best level compatibility across all matching skills
      for (const desiredSkill of user1.desiredSkills) {
        const matchingOfferedSkill = user2.offeredSkills.find(
          offered => offered.skill.toLowerCase() === desiredSkill.skill.toLowerCase()
        );

        if (matchingOfferedSkill) {
          const compatibilityScore = this.getLevelCompatibilityScore(
            desiredSkill.level,
            matchingOfferedSkill.level
          );
          score = Math.max(score, compatibilityScore);
        }
      }
    }

    return { score };
  }

  /**
   * Get level compatibility score between two skill levels
   */
  getLevelCompatibilityScore(desiredLevel, offeredLevel) {
    const levels = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
    const desired = levels[desiredLevel] || 1;
    const offered = levels[offeredLevel] || 1;

    const difference = Math.abs(desired - offered);

    if (difference === 0) return 100; // Perfect match
    if (difference === 1) return 80;  // Good match
    if (difference === 2) return 60;  // Acceptable match
    if (difference === 3) return 40;  // Poor match
    return 0; // No match
  }

  /**
   * Calculate location proximity score
   */
  calculateLocationProximity(user1, user2) {
    if (!user1.location || !user2.location) {
      return { score: 0 };
    }

    // Simple string matching for now
    // In production, you'd use geocoding services
    const loc1 = user1.location.toLowerCase().trim();
    const loc2 = user2.location.toLowerCase().trim();

    if (loc1 === loc2) {
      return { score: 100 };
    }

    // Check if locations are in the same city/region
    const loc1Parts = loc1.split(',').map(part => part.trim());
    const loc2Parts = loc2.split(',').map(part => part.trim());

    for (const part1 of loc1Parts) {
      for (const part2 of loc2Parts) {
        if (part1 === part2 && part1.length > 2) {
          return { score: 70 };
        }
      }
    }

    return { score: 0 };
  }

  /**
   * Calculate availability overlap score
   */
  calculateAvailabilityOverlap(user1, user2) {
    if (!user1.availability?.schedule || !user2.availability?.schedule) {
      return { score: 50 }; // Neutral score if no availability set
    }

    let overlapCount = 0;
    let totalSlots = 0;

    for (const day1 of user1.availability.schedule) {
      const day2 = user2.availability.schedule.find(d => d.day === day1.day);
      
      if (day2) {
        totalSlots += day1.timeSlots.length;
        
        for (const slot1 of day1.timeSlots) {
          for (const slot2 of day2.timeSlots) {
            if (this.timeSlotsOverlap(slot1, slot2)) {
              overlapCount++;
              break; // Count each user1 slot only once
            }
          }
        }
      }
    }

    if (totalSlots === 0) return { score: 50 };

    const overlapPercentage = (overlapCount / totalSlots) * 100;
    return { score: Math.round(overlapPercentage) };
  }

  /**
   * Check if two time slots overlap
   */
  timeSlotsOverlap(slot1, slot2) {
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const start1 = timeToMinutes(slot1.start);
    const end1 = timeToMinutes(slot1.end);
    const start2 = timeToMinutes(slot2.start);
    const end2 = timeToMinutes(slot2.end);

    return start1 < end2 && start2 < end1;
  }

  /**
   * Calculate mutual skills score
   */
  calculateMutualSkills(user1, user2) {
    const user1Skills = new Set(
      [...user1.offeredSkills, ...user1.desiredSkills].map(s => s.skill.toLowerCase())
    );
    const user2Skills = new Set(
      [...user2.offeredSkills, ...user2.desiredSkills].map(s => s.skill.toLowerCase())
    );

    const mutualSkills = new Set([...user1Skills].filter(skill => user2Skills.has(skill)));
    
    if (mutualSkills.size === 0) return { score: 0 };
    
    // Score based on number of mutual skills (capped at 100)
    const score = Math.min(mutualSkills.size * 20, 100);
    return { score };
  }

  /**
   * Calculate rating bonus score
   */
  calculateRatingBonus(user) {
    const rating = user.stats?.averageRating || 0;
    const totalRatings = user.stats?.totalRatings || 0;

    if (totalRatings === 0) return { score: 0 };

    // Bonus based on rating and number of ratings
    let score = (rating - 3) * 20; // Base score from rating
    score += Math.min(totalRatings * 2, 20); // Bonus for having ratings

    return { score: Math.max(0, Math.min(100, score)) };
  }

  /**
   * Calculate activity bonus score
   */
  calculateActivityBonus(user) {
    const sessionsTaught = user.stats?.sessionsTaught || 0;
    const sessionsAttended = user.stats?.sessionsAttended || 0;
    const totalSessions = sessionsTaught + sessionsAttended;

    // Bonus for being active (capped at 100)
    const score = Math.min(totalSessions * 5, 100);
    return { score };
  }

  /**
   * Create a match between two users
   */
  async createMatch(user1Id, user2Id, skill, matchType = 'skill-exchange') {
    try {
      // Check if match already exists
      const existingMatch = await Match.findOne({
        $or: [
          { user1: user1Id, user2: user2Id, skill },
          { user1: user2Id, user2: user1Id, skill }
        ]
      });

      if (existingMatch) {
        throw new Error('Match already exists');
      }

      // Calculate match score
      const user1 = await User.findById(user1Id);
      const user2 = await User.findById(user2Id);
      
      const matchResult = await this.calculateMatchScore(user1, user2, skill);

      // Create match
      const match = new Match({
        user1: user1Id,
        user2: user2Id,
        skill,
        matchType,
        score: matchResult.score,
        reasons: matchResult.reasons,
        initiatedBy: user1Id
      });

      await match.save();
      return match;
    } catch (error) {
      console.error('Error creating match:', error);
      throw error;
    }
  }
}

export default new MatchingService();
