import { useState } from 'react';
import { ExternalLink, Book, Video, FileText, Code, Palette, Music, Camera, Gamepad2, Dumbbell, ChefHat, Globe } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const ResourcesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories', icon: Globe },
    { id: 'coding', name: 'Programming', icon: Code },
    { id: 'design', name: 'Design', icon: Palette },
    { id: 'music', name: 'Music', icon: Music },
    { id: 'photography', name: 'Photography', icon: Camera },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2 },
    { id: 'fitness', name: 'Fitness', icon: Dumbbell },
    { id: 'cooking', name: 'Cooking', icon: ChefHat }
  ];

  // ALL RESOURCES ARE FREE - NO PAID CONTENT
  const resources = [
    // Programming Resources
    {
      id: '1',
      title: 'JavaScript Roadmap 2024',
      description: 'Complete roadmap to master JavaScript from beginner to advanced level',
      category: 'coding',
      type: 'roadmap',
      difficulty: 'beginner',
      duration: '6 months',
      tags: ['JavaScript', 'Web Development', 'Frontend'],
      links: [
        { type: 'roadmap', url: 'https://roadmap.sh/javascript', label: 'View Roadmap' },
        { type: 'tutorial', url: 'https://javascript.info/', label: 'JavaScript.info' },
        { type: 'practice', url: 'https://www.freecodecamp.org/', label: 'FreeCodeCamp' }
      ],
      icon: Code,
      free: true
    },
    {
      id: '2',
      title: 'Python for Data Science',
      description: 'Learn Python programming specifically for data analysis and machine learning',
      category: 'coding',
      type: 'course',
      difficulty: 'intermediate',
      duration: '4 months',
      tags: ['Python', 'Data Science', 'Machine Learning'],
      links: [
        { type: 'course', url: 'https://www.kaggle.com/learn/python', label: 'Kaggle Python' },
        { type: 'practice', url: 'https://www.kaggle.com/learn', label: 'Kaggle Learn' },
        { type: 'documentation', url: 'https://docs.python.org/', label: 'Python Docs' }
      ],
      icon: Code,
      free: true
    },
    {
      id: '3',
      title: 'React Development Path',
      description: 'Master React.js and build modern web applications',
      category: 'coding',
      type: 'roadmap',
      difficulty: 'intermediate',
      duration: '3 months',
      tags: ['React', 'JavaScript', 'Frontend'],
      links: [
        { type: 'roadmap', url: 'https://roadmap.sh/react', label: 'React Roadmap' },
        { type: 'tutorial', url: 'https://react.dev/learn', label: 'React Docs' },
        { type: 'practice', url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/', label: 'FreeCodeCamp React' }
      ],
      icon: Code,
      free: true
    },
    {
      id: '4',
      title: 'Web Development Bootcamp',
      description: 'Full-stack web development from HTML/CSS to Node.js',
      category: 'coding',
      type: 'course',
      difficulty: 'beginner',
      duration: '8 months',
      tags: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
      links: [
        { type: 'course', url: 'https://www.freecodecamp.org/learn', label: 'FreeCodeCamp' },
        { type: 'tutorial', url: 'https://www.theodinproject.com/', label: 'The Odin Project' },
        { type: 'documentation', url: 'https://developer.mozilla.org/', label: 'MDN Docs' }
      ],
      icon: Code,
      free: true
    },

    // Design Resources
    {
      id: '5',
      title: 'UI/UX Design Fundamentals',
      description: 'Learn the principles of user interface and user experience design',
      category: 'design',
      type: 'course',
      difficulty: 'beginner',
      duration: '2 months',
      tags: ['UI Design', 'UX Design', 'Figma'],
      links: [
        { type: 'course', url: 'https://learnux.io/', label: 'LearnUX' },
        { type: 'tool', url: 'https://www.figma.com/', label: 'Figma (Free)' },
        { type: 'inspiration', url: 'https://dribbble.com/', label: 'Dribbble' }
      ],
      icon: Palette,
      free: true
    },
    {
      id: '6',
      title: 'Graphic Design Basics',
      description: 'Master the fundamentals of graphic design and visual communication',
      category: 'design',
      type: 'tutorial',
      difficulty: 'beginner',
      duration: '3 months',
      tags: ['Graphic Design', 'Typography', 'Color Theory'],
      links: [
        { type: 'tutorial', url: 'https://www.canva.com/designschool/', label: 'Canva Design School' },
        { type: 'tool', url: 'https://www.canva.com/', label: 'Canva (Free)' },
        { type: 'resource', url: 'https://www.behance.net/', label: 'Behance' }
      ],
      icon: Palette,
      free: true
    },

    // Music Resources
    {
      id: '7',
      title: 'Music Theory Fundamentals',
      description: 'Learn the basics of music theory, scales, chords, and composition',
      category: 'music',
      type: 'course',
      difficulty: 'beginner',
      duration: '4 months',
      tags: ['Music Theory', 'Composition', 'Harmony'],
      links: [
        { type: 'course', url: 'https://www.musictheory.net/', label: 'MusicTheory.net' },
        { type: 'practice', url: 'https://www.teoria.com/', label: 'Teoria' },
        { type: 'tutorial', url: 'https://www.youtube.com/c/andrewhuang', label: 'Andrew Huang YouTube' }
      ],
      icon: Music,
      free: true
    },
    {
      id: '8',
      title: 'Guitar for Beginners',
      description: 'Start your guitar journey with free lessons and practice resources',
      category: 'music',
      type: 'tutorial',
      difficulty: 'beginner',
      duration: '6 months',
      tags: ['Guitar', 'Chords', 'Fingerstyle'],
      links: [
        { type: 'tutorial', url: 'https://www.justinguitar.com/', label: 'JustinGuitar' },
        { type: 'practice', url: 'https://www.ultimate-guitar.com/', label: 'Ultimate Guitar' },
        { type: 'video', url: 'https://www.youtube.com/c/Martyzsongs', label: 'MartyMusic YouTube' }
      ],
      icon: Music,
      free: true
    },

    // Photography Resources
    {
      id: '9',
      title: 'Photography Basics',
      description: 'Master camera settings, composition, and lighting techniques',
      category: 'photography',
      type: 'course',
      difficulty: 'beginner',
      duration: '3 months',
      tags: ['Photography', 'Composition', 'Lighting'],
      links: [
        { type: 'course', url: 'https://www.reddit.com/r/photoclass2023/', label: 'Reddit PhotoClass' },
        { type: 'tutorial', url: 'https://www.cambridgeincolour.com/tutorials.htm', label: 'Cambridge in Colour' },
        { type: 'inspiration', url: 'https://www.flickr.com/', label: 'Flickr' }
      ],
      icon: Camera,
      free: true
    },
    {
      id: '10',
      title: 'Photo Editing with GIMP',
      description: 'Learn professional photo editing using free open-source software',
      category: 'photography',
      type: 'tutorial',
      difficulty: 'intermediate',
      duration: '2 months',
      tags: ['Photo Editing', 'GIMP', 'Retouching'],
      links: [
        { type: 'software', url: 'https://www.gimp.org/', label: 'Download GIMP' },
        { type: 'tutorial', url: 'https://www.gimp.org/tutorials/', label: 'GIMP Tutorials' },
        { type: 'video', url: 'https://www.youtube.com/c/DaviesMediaDesign', label: 'Davies Media Design' }
      ],
      icon: Camera,
      free: true
    },

    // Fitness Resources
    {
      id: '11',
      title: 'Bodyweight Fitness Routine',
      description: 'Get fit without equipment using bodyweight exercises',
      category: 'fitness',
      type: 'program',
      difficulty: 'beginner',
      duration: '3 months',
      tags: ['Bodyweight', 'Strength', 'Flexibility'],
      links: [
        { type: 'program', url: 'https://www.reddit.com/r/bodyweightfitness/', label: 'r/bodyweightfitness' },
        { type: 'app', url: 'https://www.startbodyweight.com/', label: 'Start Bodyweight' },
        { type: 'video', url: 'https://www.youtube.com/c/FitnessBlender', label: 'Fitness Blender' }
      ],
      icon: Dumbbell,
      free: true
    },
    {
      id: '12',
      title: 'Yoga for Beginners',
      description: 'Start your yoga practice with free online classes and tutorials',
      category: 'fitness',
      type: 'course',
      difficulty: 'beginner',
      duration: '2 months',
      tags: ['Yoga', 'Flexibility', 'Mindfulness'],
      links: [
        { type: 'video', url: 'https://www.youtube.com/c/yogawithadriene', label: 'Yoga with Adriene' },
        { type: 'program', url: 'https://www.doyogawithme.com/', label: 'DoYogaWithMe' },
        { type: 'app', url: 'https://www.downdogapp.com/', label: 'Down Dog (Free)' }
      ],
      icon: Dumbbell,
      free: true
    },

    // Cooking Resources
    {
      id: '13',
      title: 'Sri Lankan Cuisine Basics',
      description: 'Learn to cook traditional Sri Lankan dishes and curries',
      category: 'cooking',
      type: 'tutorial',
      difficulty: 'beginner',
      duration: '2 months',
      tags: ['Sri Lankan', 'Curry', 'Rice & Curry'],
      links: [
        { type: 'video', url: 'https://www.youtube.com/c/apehomecooking', label: 'Ape Amma YouTube' },
        { type: 'recipe', url: 'https://www.google.com/search?q=sri+lankan+recipes', label: 'Recipe Collection' },
        { type: 'blog', url: 'https://www.google.com/search?q=sri+lankan+food+blog', label: 'Food Blogs' }
      ],
      icon: ChefHat,
      free: true
    },
    {
      id: '14',
      title: 'Cooking Fundamentals',
      description: 'Master basic cooking techniques and knife skills',
      category: 'cooking',
      type: 'course',
      difficulty: 'beginner',
      duration: '3 months',
      tags: ['Cooking', 'Knife Skills', 'Techniques'],
      links: [
        { type: 'video', url: 'https://www.youtube.com/c/foodwishes', label: 'Food Wishes' },
        { type: 'tutorial', url: 'https://www.seriouseats.com/recipes', label: 'Serious Eats' },
        { type: 'resource', url: 'https://www.budgetbytes.com/', label: 'Budget Bytes' }
      ],
      icon: ChefHat,
      free: true
    }
  ];

  // Filter resources based on selected category (only free resources)
  const filteredResources = resources.filter(resource => 
    resource.free && (selectedCategory === 'all' || resource.category === selectedCategory)
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'gray';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-200 mb-2">Learning Resources</h1>
          <p className="text-gray-400">Free roadmaps, tutorials, and resources for skill development</p>
        </div>
        <Badge variant="success" className="px-4 py-2 text-sm">100% Free Resources</Badge>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-400 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Card key={resource.id} className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 bg-primary-400/10 rounded-lg">
                  <Icon className="w-6 h-6 text-primary-400" />
                </div>
                <Badge variant={getDifficultyColor(resource.difficulty)}>
                  {resource.difficulty}
                </Badge>
              </div>

              <h3 className="text-lg font-semibold text-gray-200 mb-2">
                {resource.title}
              </h3>
              
              <p className="text-sm text-gray-400 mb-4 flex-grow">
                {resource.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="text-gray-300">{resource.duration}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {resource.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-gray-700 space-y-2">
                  <p className="text-xs font-medium text-gray-400 mb-2">Resources:</p>
                  {resource.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors group"
                    >
                      <span className="text-sm text-gray-300 group-hover:text-primary-400">
                        {link.label}
                      </span>
                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-primary-400" />
                    </a>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No resources found for this category.</p>
        </div>
      )}

      {/* Info Box */}
      <Card className="bg-primary-400/10 border-primary-400/20">
        <div className="flex items-start space-x-3">
          <Book className="w-6 h-6 text-primary-400 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-200 mb-1">All Resources Are Free!</h3>
            <p className="text-sm text-gray-400">
              We've curated only high-quality, completely free learning resources. No hidden costs,
              no premium tiers - just pure learning materials accessible to everyone.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResourcesPage;
