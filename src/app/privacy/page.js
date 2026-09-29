export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0B0F19] text-neutral-800 dark:text-neutral-300 font-sans transition-colors duration-300 w-full overflow-hidden pb-16 md:pb-24 pt-32 md:pt-40">
      <div className="max-w-[900px] mx-auto px-6 md:px-12">
        <h1 className="text-5xl md:text-7xl font-black text-[#900606] tracking-tighter uppercase mb-8 border-b-[6px] border-[#900606] pb-6 leading-none">
          Privacy Policy.
        </h1>
        
        <p className="text-sm md:text-base font-bold text-neutral-500 mb-12">Last Updated: September 29, 2026</p>

        <div className="space-y-12 text-lg md:text-xl leading-relaxed">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-[#900606] mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              At Creators Kit, we are committed to protecting your privacy. When you interact with our platform, we may collect the following types of information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-neutral-900 dark:text-white">Personal Information:</strong> Name, email address, phone number, and shipping address when you place an order or create an account.</li>
              <li><strong className="text-neutral-900 dark:text-white">Account Information:</strong> Passwords and security credentials used for authentication.</li>
              <li><strong className="text-neutral-900 dark:text-white">Usage Data:</strong> Information on how you navigate our website, including IP addresses, browser types, and session duration to help us improve the platform.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-[#900606] mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">
              The information we collect is strictly used to provide, maintain, and improve our services. Specifically, we use your data to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process your transactions and deliver your Creator Kits securely.</li>
              <li>Provide customer support and respond to inquiries or return requests.</li>
              <li>Analyze user behavior to optimize our web interface, educational masterclasses, and product offerings.</li>
              <li>Send important updates regarding your order status or changes to our policies.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-[#900606] mb-4">3. Data Security & Storage</h2>
            <p className="mb-4">
              We implement a variety of security measures to maintain the safety of your personal information.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-neutral-900 dark:text-white">Secure Local Storage:</strong> Preferences such as dark mode toggles and active sessions are stored securely in your browser's local storage or session storage.</li>
              <li><strong className="text-neutral-900 dark:text-white">Secure Checkout:</strong> All payment transactions are encrypted and processed through secure, compliant gateway providers. We do not store your full credit card details on our servers.</li>
              <li><strong className="text-neutral-900 dark:text-white">Data Encryption:</strong> Sensitive data exchanged between your browser and our servers happens over a secure SSL communication channel.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-[#900606] mb-4">4. Your Rights & Contact Information</h2>
            <p className="mb-4">
              You have the right to access, correct, or delete your personal information at any time. If you wish to exercise these rights, or if you have any questions or concerns about this Privacy Policy, please reach out to us:
            </p>
            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-6 md:p-8 shadow-lg border border-neutral-200 dark:border-neutral-800 mt-6 transition-colors duration-300">
              <p className="font-bold text-neutral-900 dark:text-white mb-2">Creators Kit Support Team</p>
              <p className="mb-1">Email: <a href="mailto:privacy@creatorskit.com" className="text-[#900606] hover:underline">privacy@creatorskit.com</a></p>
              <p>Address: 123 Creator Avenue, Studio District, CA 90210</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
