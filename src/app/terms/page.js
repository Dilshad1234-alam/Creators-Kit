import dbConnect from '@/lib/mongodb';
import Policy from '@/models/Policy';

export const dynamic = 'force-dynamic';

export default async function TermsPage() {
  let policy = null;
  try {
    await dbConnect();
    policy = await Policy.findOne({ key: 'terms' }).lean();
  } catch (error) {
    console.warn('Failed to load terms policy from database:', error.message);
  }

  const title = policy?.title || 'Terms & Conditions.';
  const updatedAt = policy?.updatedAt 
    ? new Date(policy.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'September 29, 2026';
  
  // Format content paragraphs
  const rawContent = policy?.content;
  const paragraphs = rawContent ? rawContent.split('\n\n').filter(Boolean) : null;

  return (
    <div className="min-h-[100svh] bg-[#FDFBF7] dark:bg-[#0B0F19] text-neutral-800 dark:text-neutral-300 font-sans transition-colors duration-300 w-full overflow-hidden pb-16 md:pb-24 pt-32 md:pt-40">
      <div className="max-w-[900px] mx-auto px-6 md:px-12">
        <h1 className="text-5xl md:text-7xl font-black text-[#900606] tracking-tighter uppercase mb-8 border-b-[6px] border-[#900606] pb-6 leading-none">
          {title}
        </h1>
        
        <p className="text-sm md:text-base font-bold text-neutral-500 mb-12">Last Updated: {updatedAt}</p>

        <div className="space-y-10 text-base md:text-lg leading-relaxed">
          {paragraphs && paragraphs.length > 0 ? (
            paragraphs.map((p, index) => {
              // If paragraph begins with a number like "1. Acceptance of Terms: ..."
              const splitMatch = p.match(/^(\d+\.\s*[^:\n]+):?\s*([\s\S]*)$/);
              if (splitMatch) {
                return (
                  <section key={index} className="bg-white dark:bg-[#131C2E] p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                    <h2 className="text-xl md:text-2xl font-bold text-[#900606] mb-3">
                      {splitMatch[1]}
                    </h2>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                      {splitMatch[2]}
                    </p>
                  </section>
                );
              }
              return (
                <section key={index} className="bg-white dark:bg-[#131C2E] p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                    {p}
                  </p>
                </section>
              );
            })
          ) : (
            <>
              {/* Default fallback */}
              <section className="bg-white dark:bg-[#131C2E] p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                <h2 className="text-xl md:text-2xl font-bold text-[#900606] mb-3">1. Acceptance of Terms</h2>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  By accessing the Creators Kit website and purchasing our creator gear or bundles, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our website or services. These terms apply to all visitors, users, and customers.
                </p>
              </section>

              <section className="bg-white dark:bg-[#131C2E] p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                <h2 className="text-xl md:text-2xl font-bold text-[#900606] mb-3">2. User Accounts & Security</h2>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  To access certain features of the platform, such as the checkout process or order tracking, you may be required to register for an account. You agree to provide accurate information and safeguard your credentials.
                </p>
              </section>

              <section className="bg-white dark:bg-[#131C2E] p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                <h2 className="text-xl md:text-2xl font-bold text-[#900606] mb-3">3. Products, Pricing, & Payments</h2>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  All prices are displayed in INR and/or USD. We reserve the right to change prices at any time without prior notice. All payments are processed securely via encrypted channels.
                </p>
              </section>
            </>
          )}

          <section>
            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-6 md:p-8 shadow-lg border border-neutral-200 dark:border-neutral-800 mt-6 transition-colors duration-300">
              <p className="font-bold text-neutral-900 dark:text-white mb-2">Have questions about these terms?</p>
              <p className="mb-1 text-sm text-neutral-600 dark:text-neutral-400">
                Contact Legal: <a href="mailto:legal@creatorskit.com" className="text-[#900606] font-bold hover:underline">legal@creatorskit.com</a>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
