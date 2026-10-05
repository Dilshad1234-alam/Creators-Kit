export default function TermsPage() {
  return (
    <div className="min-h-[100svh] bg-[#FDFBF7] dark:bg-[#0B0F19] text-neutral-800 dark:text-neutral-300 font-sans transition-colors duration-300 w-full overflow-hidden pb-16 md:pb-24 pt-32 md:pt-40">
      <div className="max-w-[900px] mx-auto px-6 md:px-12">
        <h1 className="text-5xl md:text-7xl font-black text-[#900606] tracking-tighter uppercase mb-8 border-b-[6px] border-[#900606] pb-6 leading-none">
          Terms & Conditions.
        </h1>
        
        <p className="text-sm md:text-base font-bold text-neutral-500 mb-12">Last Updated: September 29, 2026</p>

        <div className="space-y-12 text-lg md:text-xl leading-relaxed">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-[#900606] mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing the Creators Kit website and purchasing our creator gear or bundles, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our website or services. These terms apply to all visitors, users, and customers.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-[#900606] mb-4">2. User Accounts & Security</h2>
            <p className="mb-4">
              To access certain features of the platform, such as the checkout process or order tracking, you may be required to register for an account. 
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-neutral-900 dark:text-white">Account Details:</strong> You agree to provide accurate and complete information when registering an account.</li>
              <li><strong className="text-neutral-900 dark:text-white">Security:</strong> You are solely responsible for protecting your account credentials and password.</li>
              <li><strong className="text-neutral-900 dark:text-white">Data Persistence:</strong> Certain non-sensitive preferences (like dark mode toggles and wishlist items) are stored locally in your browser to enhance your experience.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-[#900606] mb-4">3. Products, Pricing, & Payments</h2>
            <p className="mb-4">
              We strive to display our Creator Kit bundles as accurately as possible, but we cannot guarantee that your device's display of colors or features will be completely accurate.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-neutral-900 dark:text-white">Pricing:</strong> All prices are displayed in INR and/or USD. We reserve the right to change prices at any time without prior notice.</li>
              <li><strong className="text-neutral-900 dark:text-white">Shipping:</strong> Shipping policies, estimated delivery times, and additional charges (if any) are provided during the secure checkout process.</li>
              <li><strong className="text-neutral-900 dark:text-white">Secure Checkout:</strong> All payments are processed securely. We reserve the right to refuse or cancel any order for reasons including suspected fraud or inventory issues.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-[#900606] mb-4">4. Returns, Refunds, & Intellectual Property</h2>
            <p className="mb-4">
              Please review our dedicated Return Policy for full details on how to return physical items. 
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-neutral-900 dark:text-white">Refunds:</strong> Eligible refunds will be processed back to the original payment method. Digital assets, including the masterclasses included in the bundle, are strictly non-refundable once accessed.</li>
              <li><strong className="text-neutral-900 dark:text-white">Intellectual Property:</strong> All content, images, videos, and masterclass materials provided by Creators Kit remain our exclusive intellectual property and may not be reproduced, distributed, or resold without explicit written permission.</li>
            </ul>
          </section>

          <section>
            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-6 md:p-8 shadow-lg border border-neutral-200 dark:border-neutral-800 mt-6 transition-colors duration-300">
              <p className="font-bold text-neutral-900 dark:text-white mb-2">Have questions about these terms?</p>
              <p className="mb-1">Contact Legal: <a href="mailto:legal@creatorskit.com" className="text-[#900606] hover:underline">legal@creatorskit.com</a></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
