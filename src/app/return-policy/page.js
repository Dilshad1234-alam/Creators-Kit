import dbConnect from '@/lib/mongodb';
import Policy from '@/models/Policy';

export const dynamic = 'force-dynamic';

export default async function ReturnPolicyPage() {
  let policy = null;
  try {
    await dbConnect();
    policy = await Policy.findOne({ key: 'return' }).lean();
  } catch (error) {
    console.warn('Failed to load return policy from database:', error.message);
  }

  const title = policy?.title || 'Return & Refund Policy.';
  const updatedAt = policy?.updatedAt 
    ? new Date(policy.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'September 29, 2026';

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
              <section className="bg-white dark:bg-[#131C2E] p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                <h2 className="text-xl md:text-2xl font-bold text-[#900606] mb-3">1. The 7-Day Return Window</h2>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  We offer a hassle-free, 7-day replacement guarantee on physical equipment. If any item arrives damaged or non-functional, contact us within 7 days of delivery for a prompt replacement or refund.
                </p>
              </section>

              <section className="bg-white dark:bg-[#131C2E] p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                <h2 className="text-xl md:text-2xl font-bold text-[#900606] mb-3">2. Conditions for Returning Gear</h2>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  The gear must be unused, in its original factory packaging with all accessories, cables, stands, and documentation included.
                </p>
              </section>

              <section className="bg-white dark:bg-[#131C2E] p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                <h2 className="text-xl md:text-2xl font-bold text-[#900606] mb-3">3. Process & Support</h2>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Our logistics team coordinates doorstep pickup. Once returned and inspected at our fulfillment center, refunds are credited back to your original payment method.
                </p>
              </section>
            </>
          )}

          <section>
            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-6 md:p-8 shadow-lg border border-neutral-200 dark:border-neutral-800 mt-6 transition-colors duration-300">
              <p className="font-bold text-neutral-900 dark:text-white mb-2">Need to initiate a return or replacement?</p>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Email our customer care team at <a href="mailto:support@creatorskit.com" className="text-[#900606] font-bold hover:underline">support@creatorskit.com</a> with your Order ID.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
