import { Shield } from 'lucide-react';
import Card from '../../components/ui/Card';

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="w-8 h-8 text-primary-400" />
        <h1 className="text-3xl font-bold text-gray-200">Privacy Policy</h1>
      </div>

      <Card>
        <p className="text-sm text-gray-400 mb-6">Last Updated: October 14, 2025</p>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">1. Information We Collect</h2>
            <p className="mb-3">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Name, email address, and profile information</li>
              <li>Skills, qualifications, and learning preferences</li>
              <li>Messages and communications with other users</li>
              <li>Session history and reviews</li>
              <li>Payment and billing information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">2. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Match you with appropriate learning partners</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Prevent fraud and ensure platform safety</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">3. Information Sharing</h2>
            <p className="mb-3">We do not sell your personal information. We may share your information:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>With other users as part of the service</li>
              <li>With service providers who assist our operations</li>
              <li>To comply with legal obligations</li>
              <li>With your consent or at your direction</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">5. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of marketing communications</li>
              <li>Request a copy of your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">6. Cookies</h2>
            <p>We use cookies and similar technologies to provide and improve our services. You can control cookies through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">7. Children's Privacy</h2>
            <p>Our service is not intended for users under 13 years of age. We do not knowingly collect information from children under 13.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">8. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">9. Contact Us</h2>
            <p>If you have questions about this privacy policy, please contact us at:</p>
            <p className="mt-2">Email: privacy@skillshare.lk</p>
          </section>
        </div>
      </Card>
    </div>
  );
};

export default PrivacyPolicyPage;

