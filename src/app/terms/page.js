import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Policy from '@/models/Policy';
import {
  Scale,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  Lock,
  UserCheck,
  ChevronRight,
  Headphones,
  ExternalLink,
  Gavel,
  Truck,
  RotateCcw,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Terms of Service | Creators Kit',
  description:
    'Terms of Service and legal agreement for Creators Kit. Review user terms, order conditions, intellectual property rights, and platform policies.',
};

export default async function TermsPage() {
  let policy = null;
  try {
    await dbConnect();
    policy = await Policy.findOne({ key: 'terms' }).lean();
  } catch (error) {
    console.warn('Failed to load terms policy from database:', error.message);
  }

  const updatedAt = policy?.updatedAt
    ? new Date(policy.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'November 13, 2026';

  const rawContent = policy?.content;
  // Cleanly split paragraphs and filter out redundant single-line titles like "Terms & Conditions"
  const rawParagraphs = rawContent ? rawContent.split('\n\n').map((p) => p.trim()).filter(Boolean) : null;
  const dbParagraphs = rawParagraphs
    ? rawParagraphs.filter((p) => !/^(terms\s*(&|and)?\s*conditions|terms\s*of\s*service)$/i.test(p.trim()))
    : null;

  return (
    <div className="min-h-[100svh] bg-[#FBFBF7] dark:bg-[#0B0F19] text-[#111827] dark:text-neutral-100 font-sans transition-colors duration-300 w-full overflow-hidden pb-16 md:pb-24 pt-28 md:pt-36">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-neutral-500">
          <Link href="/" className="hover:text-[#900606] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            Terms of Service
          </span>
        </nav>

        {/* Hero Header Section - Styling matched with Home "Shop by Category" */}
        <header className="flex flex-col items-center text-center mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 border border-red-200/60 dark:border-red-900/40 mb-4 shadow-2xs">
            <Scale className="w-3.5 h-3.5 text-[#900606] dark:text-red-400" />
            <span>Legal Framework & Platform Agreement</span>
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight">
            Terms of <span className="text-[#900606] whitespace-nowrap">Service</span>
          </h1>

          <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base md:text-lg font-normal max-w-2xl mt-3 leading-relaxed">
            Please read these terms carefully before accessing or using Creators Kit. By using our website and purchasing our creator equipment, you agree to these commercial terms.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-5 text-xs font-medium text-neutral-400">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-neutral-500" />
              Last Updated: {updatedAt}
            </span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Official Creators Kit Agreement
            </span>
          </div>
        </header>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 md:mb-12">
          <div className="bg-white dark:bg-[#131C2E] p-4 sm:p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-2xs flex flex-col items-start">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 flex items-center justify-center mb-2.5">
              <Scale className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Fair Terms</span>
            <span className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white mt-0.5">Fair Usage</span>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 leading-snug">Transparent commercial & ordering policies</p>
          </div>

          <div className="bg-white dark:bg-[#131C2E] p-4 sm:p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-2xs flex flex-col items-start">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 flex items-center justify-center mb-2.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Hardware</span>
            <span className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white mt-0.5">100% Genuine</span>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 leading-snug">Authentic studio equipment with warranty</p>
          </div>

          <div className="bg-white dark:bg-[#131C2E] p-4 sm:p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-2xs flex flex-col items-start">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 flex items-center justify-center mb-2.5">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">IP Protection</span>
            <span className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white mt-0.5">Masterclass IP</span>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 leading-snug">Copyright protection on proprietary content</p>
          </div>

          <div className="bg-white dark:bg-[#131C2E] p-4 sm:p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-2xs flex flex-col items-start">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 flex items-center justify-center mb-2.5">
              <Gavel className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Jurisdiction</span>
            <span className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white mt-0.5">Indian Law</span>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 leading-snug">Governed under Noida / UP jurisdiction</p>
          </div>
        </div>

        {/* Database Content OR Default Policy Articles */}
        <main className="space-y-6 sm:space-y-8">
          {dbParagraphs && dbParagraphs.length > 0 ? (
            dbParagraphs.map((paragraph, idx) => {
              const match = paragraph.match(/^(\d+[\.\)]?\s*[^:\n]+):?\s*([\s\S]*)$/);
              if (match) {
                const clauseNum = String(idx + 1).padStart(2, '0');
                const titleText = match[1].replace(/^\d+[\.\)]?\s*/, '').trim();
                return (
                  <article
                    key={idx}
                    className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all"
                  >
                    <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                        {clauseNum}
                      </span>
                      <span>{titleText}</span>
                    </h2>
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                      {match[2]}
                    </p>
                  </article>
                );
              }
              return (
                <article
                  key={idx}
                  className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all"
                >
                  <p className="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {paragraph}
                  </p>
                </article>
              );
            })
          ) : (
            <>
              {/* Clause 1 */}
              <article className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                    01
                  </span>
                  <span>
                    Acceptance of <span className="text-[#900606]">Terms</span>
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    By accessing or using the <strong>Creators Kit</strong> website (<strong>creatorskithub.com</strong>), purchasing our studio equipment, kits, or bundles, or enrolling in our video masterclasses, you agree to be bound by these Terms of Service, our Privacy Policy, and our Refund Policy.
                  </p>
                  <p>
                    These terms apply to all visitors, registered users, customers, and creators. If you do not agree with any provision of these terms, you must refrain from using the platform and purchasing items.
                  </p>
                </div>
              </article>

              {/* Clause 2 */}
              <article className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                    02
                  </span>
                  <span>
                    User Accounts & <span className="text-[#900606]">Authentication Security</span>
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    To access your orders, track parcel progress, or stream unlocked creator masterclasses, you create an account via your email and a secure password.
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm">
                    <li>
                      <strong>Accurate Information:</strong> You agree to provide true, current, and complete details during checkout and registration.
                    </li>
                    <li>
                      <strong>Account Confidentiality:</strong> You are strictly responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
                    </li>
                    <li>
                      <strong>Suspension Rights:</strong> We reserve the right to suspend or terminate accounts that provide misleading information or engage in abusive or unauthorized behavior.
                    </li>
                  </ul>
                </div>
              </article>

              {/* Clause 3 */}
              <article className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                    03
                  </span>
                  <span>
                    Products, Pricing & <span className="text-[#900606]">Payment Processing</span>
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    We make every effort to display product specifications, dimensions, features, and colors accurately. All monetary transactions are processed securely through certified payment gateways.
                  </p>
                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/60 text-xs sm:text-sm space-y-1.5">
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#900606]" />
                      <strong>Currency & Taxes:</strong> All retail prices are displayed in Indian Rupees (₹ INR) inclusive of applicable GST unless explicitly stated otherwise.
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#900606]" />
                      <strong>Price Adjustments:</strong> Creators Kit reserves the right to modify prices, flash deals, or bundle discounts without prior notice.
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#900606]" />
                      <strong>Payment Security:</strong> We do not store raw credit card numbers or banking passwords. Transactions comply with bank-grade encryption and RBI security guidelines.
                    </p>
                  </div>
                </div>
              </article>

              {/* Clause 4 */}
              <article className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                    04
                  </span>
                  <span>
                    Shipping, Delivery & <span className="text-[#900606]">Transit Risk</span>
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    Orders are packed and dispatched via verified express logistics partners. Delivery timelines and terms are outlined in our dedicated{' '}
                    <Link href="/shipping" className="text-[#900606] font-bold hover:underline inline-flex items-center gap-1">
                      <span>Shipping Policy</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>.
                  </p>
                  <p>
                    Risk of loss transfers to the customer once the courier records proof of delivery at the specified destination address. Any physical tampering or transit damage must be reported within 24 hours of delivery.
                  </p>
                </div>
              </article>

              {/* Clause 5 */}
              <article className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                    05
                  </span>
                  <span>
                    Intellectual Property & <span className="text-[#900606]">Masterclass Rights</span>
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    All content featured on creatorskithub.com—including brand trademarks, logo designs, photographs, product descriptions, video masterclasses, audio assets, and downloadable resources—is the sole intellectual property of <strong>Creators Kit</strong> and <strong>Zinmatt</strong>.
                  </p>
                  <div className="p-4 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#900606] shrink-0 mt-0.5" />
                    <div>
                      <strong>Prohibited Commercial Redistribution:</strong> You are granted a limited, personal, non-transferable license to view purchased masterclasses. Recording, duplicating, screen-scraping, or reselling our digital courses will result in immediate copyright infringement action.
                    </div>
                  </div>
                </div>
              </article>

              {/* Clause 6 */}
              <article className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                    06
                  </span>
                  <span>
                    Limitation of Liability & <span className="text-[#900606]">Governing Law</span>
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    To the maximum extent permitted by applicable law, Creators Kit shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from equipment mishandling, electrical surges, or third-party delivery delays.
                  </p>
                  <p>
                    These Terms of Service are governed and interpreted under the laws of the Republic of India. Any dispute, claim, or controversy arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Gautam Buddha Nagar / Noida, Uttar Pradesh</strong>.
                  </p>
                </div>
              </article>
            </>
          )}

          {/* Dedicated Legal Contact Card */}
          <section className="bg-gradient-to-br from-white to-neutral-50 dark:from-[#131C2E] dark:to-[#0E1524] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#900606] uppercase tracking-wider">
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Creators Kit Legal & Compliance Desk</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white">
                  Have questions regarding our Terms of Service?
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
                  Our legal and compliance team is available to assist you with contract inquiries, copyright questions, or corporate procurement terms.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
                <a
                  href="mailto:support@creatorskit.com"
                  className="px-5 py-2.5 bg-[#900606] hover:bg-[#780505] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all text-center flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Scale className="w-4 h-4" />
                  <span>Contact Legal</span>
                </a>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 font-bold text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 transition-all text-center flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Headphones className="w-4 h-4" />
                  <span>Customer Support</span>
                </Link>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-200/80 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
              <p>
                Compliance Officer: <a href="mailto:support@creatorskit.com" className="text-[#900606] font-semibold hover:underline">support@creatorskit.com</a>
              </p>
              <div className="flex items-center gap-4">
                <Link href="/privacy" className="hover:text-[#900606] transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Privacy Policy</span>
                </Link>
                <Link href="/shipping" className="hover:text-[#900606] transition-colors flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  <span>Shipping Policy</span>
                </Link>
                <Link href="/refund" className="hover:text-[#900606] transition-colors flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" />
                  <span>Refund Policy</span>
                </Link>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
