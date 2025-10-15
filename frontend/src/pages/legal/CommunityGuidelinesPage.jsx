import { Users } from 'lucide-react';
import Card from '../../components/ui/Card';

const CommunityGuidelinesPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Users className="w-8 h-8 text-primary-400" />
        <h1 className="text-3xl font-bold text-gray-200">Community Guidelines</h1>
      </div>

      <Card>
        <p className="text-sm text-gray-400 mb-6">Building a Safe and Respectful Learning Community</p>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">Our Community Values</h2>
            <p>SkillShare is built on mutual respect, trust, and the shared goal of learning. We expect all members to contribute to a positive, safe, and inclusive environment.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">1. Be Respectful</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Treat everyone with dignity and respect</li>
              <li>Be patient with learners at all skill levels</li>
              <li>Accept and celebrate diversity</li>
              <li>Use inclusive and appropriate language</li>
              <li>Respect different learning styles and paces</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">2. Be Honest</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Accurately represent your skills and experience</li>
              <li>Be truthful in your profile information</li>
              <li>Provide honest feedback and reviews</li>
              <li>Admit when you don't know something</li>
              <li>Honor your commitments and schedules</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">3. Be Helpful</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Share knowledge generously</li>
              <li>Provide constructive feedback</li>
              <li>Encourage and support fellow learners</li>
              <li>Contribute to a positive learning experience</li>
              <li>Help maintain community standards</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">4. Prohibited Behavior</h2>
            <p className="mb-3">The following behaviors are strictly prohibited:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Harassment, bullying, or intimidation</li>
              <li>Hate speech or discrimination</li>
              <li>Sexual harassment or inappropriate content</li>
              <li>Spam or unsolicited marketing</li>
              <li>Fraudulent activities or scams</li>
              <li>Sharing private information without consent</li>
              <li>Violence or threats of violence</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">5. Session Etiquette</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Be punctual for scheduled sessions</li>
              <li>Come prepared with necessary materials</li>
              <li>Minimize distractions during sessions</li>
              <li>Give advance notice if you need to cancel</li>
              <li>Follow through on agreed-upon learning goals</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">6. Content Standards</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Share only appropriate, educational content</li>
              <li>Respect intellectual property rights</li>
              <li>Do not share copyrighted material without permission</li>
              <li>Keep content relevant to skill-sharing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">7. Reporting Violations</h2>
            <p className="mb-3">If you encounter behavior that violates these guidelines:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use the "Report" button on user profiles</li>
              <li>Provide specific details about the violation</li>
              <li>Contact support at support@skillshare.lk</li>
              <li>Do not engage in retaliatory behavior</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">8. Consequences</h2>
            <p className="mb-3">Violations may result in:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Warning and required corrective action</li>
              <li>Temporary suspension of account</li>
              <li>Permanent ban from the platform</li>
              <li>Legal action in severe cases</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">9. Your Role</h2>
            <p>Every member plays a role in maintaining our community standards. By using SkillShare, you agree to uphold these guidelines and help create a positive learning environment for all.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">Questions?</h2>
            <p>If you have questions about these guidelines, contact us at:</p>
            <p className="mt-2">Email: community@skillshare.lk</p>
          </section>
        </div>
      </Card>
    </div>
  );
};

export default CommunityGuidelinesPage;

