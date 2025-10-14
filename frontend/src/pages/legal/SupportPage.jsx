import { HelpCircle, Mail, MessageCircle, Book, Phone } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const SupportPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <HelpCircle className="w-8 h-8 text-primary-400" />
        <h1 className="text-3xl font-bold text-gray-200">Support Center</h1>
      </div>

      <Card>
        <p className="text-gray-300 mb-6">We're here to help! Choose the best way to get in touch with us.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Email Support */}
          <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
            <Mail className="w-8 h-8 text-primary-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Email Support</h3>
            <p className="text-sm text-gray-400 mb-4">Get help via email within 24 hours</p>
            <a href="mailto:support@skillshare.lk" className="text-primary-400 hover:underline">
              support@skillshare.lk
            </a>
          </div>

          {/* Live Chat */}
          <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
            <MessageCircle className="w-8 h-8 text-primary-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Live Chat</h3>
            <p className="text-sm text-gray-400 mb-4">Chat with us in real-time</p>
            <Button size="sm">Start Chat</Button>
          </div>

          {/* Phone Support */}
          <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
            <Phone className="w-8 h-8 text-primary-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Phone Support</h3>
            <p className="text-sm text-gray-400 mb-4">Call us Monday-Friday, 9 AM - 6 PM IST</p>
            <a href="tel:+94112345678" className="text-primary-400 hover:underline">
              +94 11 234 5678
            </a>
          </div>

          {/* Documentation */}
          <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
            <Book className="w-8 h-8 text-primary-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Documentation</h3>
            <p className="text-sm text-gray-400 mb-4">Browse our help articles and guides</p>
            <Button size="sm" variant="outline">View Docs</Button>
          </div>
        </div>
      </Card>

      {/* FAQs */}
      <Card>
        <h2 className="text-2xl font-semibold text-gray-200 mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <details className="p-4 bg-gray-800 rounded-lg">
            <summary className="font-medium text-gray-200 cursor-pointer">How do I create an account?</summary>
            <p className="mt-3 text-gray-400 text-sm">Click the "Sign Up" button in the top right corner, fill in your details, and verify your email address.</p>
          </details>

          <details className="p-4 bg-gray-800 rounded-lg">
            <summary className="font-medium text-gray-200 cursor-pointer">How do I find a learning partner?</summary>
            <p className="mt-3 text-gray-400 text-sm">Go to the Explore page, add your desired skills, and browse through matched users. You can send connection requests to users you'd like to learn from.</p>
          </details>

          <details className="p-4 bg-gray-800 rounded-lg">
            <summary className="font-medium text-gray-200 cursor-pointer">How do I schedule a session?</summary>
            <p className="mt-3 text-gray-400 text-sm">Navigate to the Sessions page, click "Book Session", select the skill, date, and time, then send a request to your learning partner.</p>
          </details>

          <details className="p-4 bg-gray-800 rounded-lg">
            <summary className="font-medium text-gray-200 cursor-pointer">Is video calling secure?</summary>
            <p className="mt-3 text-gray-400 text-sm">Yes! We use Jitsi Meet, an encrypted open-source video conferencing solution. All calls are end-to-end encrypted.</p>
          </details>

          <details className="p-4 bg-gray-800 rounded-lg">
            <summary className="font-medium text-gray-200 cursor-pointer">How do I report inappropriate behavior?</summary>
            <p className="mt-3 text-gray-400 text-sm">Click the "Report" button on any user's profile, select the reason, and provide details. Our team will review it within 24 hours.</p>
          </details>

          <details className="p-4 bg-gray-800 rounded-lg">
            <summary className="font-medium text-gray-200 cursor-pointer">Can I delete my account?</summary>
            <p className="mt-3 text-gray-400 text-sm">Yes, go to Settings → Account → Delete Account. Note that this action is permanent and cannot be undone.</p>
          </details>

          <details className="p-4 bg-gray-800 rounded-lg">
            <summary className="font-medium text-gray-200 cursor-pointer">How do I verify my skills?</summary>
            <p className="mt-3 text-gray-400 text-sm">On your Profile page, click "Add Verification", select the skill, and upload your certificate or portfolio. Our team will review it within 2-3 business days.</p>
          </details>

          <details className="p-4 bg-gray-800 rounded-lg">
            <summary className="font-medium text-gray-200 cursor-pointer">What payment methods do you accept?</summary>
            <p className="mt-3 text-gray-400 text-sm">We accept credit/debit cards, bank transfers, and mobile payment options like eZ Cash and mCash for Sri Lankan users.</p>
          </details>

          <details className="p-4 bg-gray-800 rounded-lg">
            <summary className="font-medium text-gray-200 cursor-pointer">How do I change my password?</summary>
            <p className="mt-3 text-gray-400 text-sm">Go to Settings → Security → Change Password. Enter your current password and your new password twice to confirm.</p>
          </details>

          <details className="p-4 bg-gray-800 rounded-lg">
            <summary className="font-medium text-gray-200 cursor-pointer">Can I use SkillShare on mobile?</summary>
            <p className="mt-3 text-gray-400 text-sm">Yes! SkillShare is a Progressive Web App (PWA). You can install it on your mobile device for a native app-like experience.</p>
          </details>
        </div>
      </Card>

      {/* Contact Form */}
      <Card>
        <h2 className="text-2xl font-semibold text-gray-200 mb-6">Send Us a Message</h2>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="How can we help?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
            <textarea
              rows="5"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Describe your issue or question..."
            />
          </div>

          <Button type="submit" className="w-full">Send Message</Button>
        </form>
      </Card>
    </div>
  );
};

export default SupportPage;
