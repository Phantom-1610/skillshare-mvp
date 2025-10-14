import { FileText } from 'lucide-react';
import Card from '../../components/ui/Card';

const TermsOfServicePage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="w-8 h-8 text-primary-400" />
        <h1 className="text-3xl font-bold text-gray-200">Terms of Service</h1>
      </div>

      <Card>
        <p className="text-sm text-gray-400 mb-6">Last Updated: October 14, 2025</p>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using SkillShare, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">2. Use License</h2>
            <p className="mb-3">Permission is granted to temporarily access the materials on SkillShare for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software</li>
              <li>Remove any copyright or proprietary notations</li>
              <li>Transfer the materials to another person</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">3. User Responsibilities</h2>
            <p className="mb-3">As a user, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide accurate and truthful information</li>
              <li>Maintain the confidentiality of your account</li>
              <li>Notify us immediately of unauthorized use</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Respect other users and their intellectual property</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">4. Prohibited Activities</h2>
            <p className="mb-3">You may not:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Harass, abuse, or harm another person</li>
              <li>Provide false or misleading information</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with or disrupt the service</li>
              <li>Upload viruses or malicious code</li>
              <li>Collect information about other users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">5. Content</h2>
            <p>You retain ownership of content you post. By posting, you grant us a license to use, modify, and display that content in connection with our service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">6. Payment Terms</h2>
            <p className="mb-3">For paid services:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>All fees are in Sri Lankan Rupees (LKR) unless stated otherwise</li>
              <li>Payment is due immediately upon purchase</li>
              <li>Refunds are subject to our refund policy</li>
              <li>Prices may change with 30 days notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">7. Termination</h2>
            <p>We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">8. Disclaimer</h2>
            <p>The service is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted or error-free.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">9. Limitation of Liability</h2>
            <p>SkillShare shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">10. Governing Law</h2>
            <p>These terms shall be governed by the laws of Sri Lanka without regard to its conflict of law provisions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">11. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">12. Contact Information</h2>
            <p>For questions about these Terms, contact us at:</p>
            <p className="mt-2">Email: legal@skillshare.lk</p>
          </section>
        </div>
      </Card>
    </div>
  );
};

export default TermsOfServicePage;
