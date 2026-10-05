export default function ReturnPolicyPage() {
  return (
    <div className="min-h-[100svh] bg-[#FDFBF7] dark:bg-[#0B0F19] text-neutral-800 dark:text-neutral-300 font-sans transition-colors duration-300 w-full overflow-hidden pb-16 md:pb-24 pt-32 md:pt-40">
      <div className="max-w-[900px] mx-auto px-6 md:px-12">
        <h1 className="text-5xl md:text-7xl font-black text-[#900606] tracking-tighter uppercase mb-8 border-b-[6px] border-[#900606] pb-6 leading-none">
          Return Policy.
        </h1>
        
        <p className="text-sm md:text-base font-bold text-neutral-500 mb-12">Last Updated: September 29, 2026</p>

        <div className="space-y-12 text-lg md:text-xl leading-relaxed">
          
          <section>
            <p className="mb-4">
              At Creators Kit, we are obsessed with providing high-quality gear to help you create your best content. If you are not completely satisfied with your purchase, we’re here to help. Please read our return and refund policy carefully to understand your rights and the procedures for returning products.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-[#900606] mb-4">1. The 7-Day Return Window</h2>
            <p className="mb-4">
              We offer a hassle-free, 7-day return policy on physical merchandise. You have exactly 7 days from the date your tracking number marks the package as "Delivered" to initiate a return request. Requests made after this 7-day period will not be eligible for a refund.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-[#900606] mb-4">2. Conditions for Returning Gear</h2>
            <p className="mb-4">
              To be eligible for a return and full refund, the following criteria must be strictly met:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-neutral-900 dark:text-white">Original Condition:</strong> The physical gear (ring light, tripod, green screen, audio equipment) must be unused, free of scratches, and in the same pristine condition that you received it.</li>
              <li><strong className="text-neutral-900 dark:text-white">Original Packaging:</strong> All items must be returned in their original, undamaged packaging. This includes all manuals, cables, foam inserts, and accessories.</li>
              <li><strong className="text-neutral-900 dark:text-white">Proof of Purchase:</strong> You must provide your valid Order ID and the email address used during checkout.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-[#900606] mb-4">3. Non-Returnable Items</h2>
            <p className="mb-4">
              Please note that certain items within the Creators Kit ecosystem are strictly non-refundable:
            </p>
            <div className="bg-neutral-100 dark:bg-[#131C2E] rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
              <ul className="list-disc pl-4 space-y-2 text-neutral-700 dark:text-neutral-400">
                <li><strong className="text-neutral-900 dark:text-white">Digital Masterclasses:</strong> Due to the immediate and un-revokeable access nature of digital educational content, the video masterclasses included in your bundle cannot be refunded.</li>
                <li><strong className="text-neutral-900 dark:text-white">Gift Cards:</strong> Purchased gift cards or digital store credits.</li>
                <li><strong className="text-neutral-900 dark:text-white">Clearance Items:</strong> Physical gear explicitly marked as "Final Sale" or "Clearance" at the time of purchase.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-[#900606] mb-4">4. Step-by-Step Refund Process</h2>
            <p className="mb-4">
              If your items meet the criteria above, follow these steps to process your return:
            </p>
            <ol className="list-decimal pl-6 space-y-4">
              <li><strong className="text-neutral-900 dark:text-white">Initiate the Request:</strong> Visit our <a href="/return" className="text-[#900606] font-bold hover:underline">Return Request Portal</a> and submit your Order ID and reason for return.</li>
              <li><strong className="text-neutral-900 dark:text-white">Approval & Label:</strong> Our support team will review the request within 24-48 hours. Upon approval, we will email you a prepaid shipping label (the cost of return shipping may be deducted from your final refund).</li>
              <li><strong className="text-neutral-900 dark:text-white">Ship It Back:</strong> Pack the items securely in their original packaging, attach the label, and drop off the package at the designated courier facility within 3 days of receiving the label.</li>
              <li><strong className="text-neutral-900 dark:text-white">Inspection & Refund:</strong> Once received, our warehouse will inspect the return. If approved, your refund will be processed to the original method of payment within 5-7 business days.</li>
            </ol>
          </section>

          <section>
            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-6 md:p-8 shadow-lg border border-neutral-200 dark:border-neutral-800 mt-8 transition-colors duration-300">
              <p className="font-bold text-neutral-900 dark:text-white mb-2">Need to speak with someone?</p>
              <p className="mb-1">Contact Support: <a href="mailto:support@creatorskit.com" className="text-[#900606] hover:underline">support@creatorskit.com</a></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
