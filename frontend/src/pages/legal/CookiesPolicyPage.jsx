import { Cookie } from 'lucide-react';
import Card from '../../components/ui/Card';

const CookiesPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Cookie className="w-8 h-8 text-primary-400" />
        <h1 className="text-3xl font-bold text-gray-200">Cookies Policy</h1>
      </div>

      <Card>
        <p className="text-sm text-gray-400 mb-6">Last Updated: October 14, 2025</p>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">What Are Cookies?</h2>
            <p>Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">How We Use Cookies</h2>
            <p className="mb-3">We use cookies for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Authentication:</strong> To keep you logged in and secure your account</li>
              <li><strong>Preferences:</strong> To remember your settings and preferences</li>
              <li><strong>Security:</strong> To protect your account and detect fraud</li>
              <li><strong>Analytics:</strong> To understand how you use our service</li>
              <li><strong>Performance:</strong> To improve loading times and functionality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">Types of Cookies We Use</h2>
            
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-200 mb-2">Essential Cookies</h3>
                <p className="text-sm">These cookies are necessary for the website to function. They enable basic features like page navigation and access to secure areas.</p>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-200 mb-2">Functional Cookies</h3>
                <p className="text-sm">These cookies allow us to remember choices you make (like your username or language) and provide enhanced features.</p>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-200 mb-2">Analytics Cookies</h3>
                <p className="text-sm">These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-200 mb-2">Performance Cookies</h3>
                <p className="text-sm">These cookies help us improve the performance of our website by tracking page load times and user experience metrics.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">Third-Party Cookies</h2>
            <p className="mb-3">We may also use third-party cookies from:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Jitsi Meet (for video conferencing functionality)</li>
              <li>Analytics providers (to understand usage patterns)</li>
              <li>Payment processors (for secure transactions)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">Managing Cookies</h2>
            <p className="mb-3">You have control over cookies. You can:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Block all cookies through your browser settings</li>
              <li>Delete cookies that have already been set</li>
              <li>Allow cookies only from specific websites</li>
              <li>Set your browser to notify you when cookies are sent</li>
            </ul>
            <p className="mt-3 text-sm">Note: Blocking essential cookies may affect the functionality of our service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">Browser-Specific Instructions</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</p>
              <p><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</p>
              <p><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</p>
              <p><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">Cookie Duration</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain until expiration or manual deletion (typically 1-2 years)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">Updates to This Policy</h2>
            <p>We may update this cookies policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">Contact Us</h2>
            <p>If you have questions about our use of cookies, please contact us at:</p>
            <p className="mt-2">Email: privacy@skillshare.lk</p>
          </section>
        </div>
      </Card>
    </div>
  );
};

export default CookiesPolicyPage;

