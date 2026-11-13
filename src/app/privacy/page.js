import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Policy from '@/models/Policy';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Database,
  Cookie,
  KeyRound,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Headphones,
  FileText,
  Truck,
  RotateCcw,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Privacy Policy | Creators Kit',
  description:
    'Privacy Policy for Creators Kit. Learn how we safeguard your personal data, secure authentication, process payments, and protect creator information.',
};

export default async function PrivacyPage() {
  let policy = null;
  try {
    await dbConnect();
    policy = await Policy.findOne({ key: 'privacy' }).lean();
  } catch (error) {
    console.warn('Failed to load privacy policy from database:', error.message);
  }

  const updatedAt = policy?.updatedAt
    ? new Date(policy.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'November 13, 2026';

  const rawContent = policy?.content;
  // Cleanly split paragraphs and filter out redundant single-line titles like "Privacy Policy"
  const rawParagraphs = rawContent ? rawContent.split('\n\n').map((p) => p.trim()).filter(Boolean) : null;
  const dbParagraphs = rawParagraphs
    ? rawParagraphs.filter((p) => !/^(privacy\s*policy)$/i.test(p.trim()))
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
            Privacy Policy
          </span>
        </nav>

        {/* Hero Header Section - Styling matched with Home "Shop by Category" */}
        <header className="flex flex-col items-center text-center mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 border border-red-200/60 dark:border-red-900/40 mb-4 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#900606] dark:text-red-400" />
            <span>User Privacy & Data Protection Commitment</span>
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight">
            Privacy <span className="text-[#900606] whitespace-nowrap">Policy</span>
          </h1>

          <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base md:text-lg font-normal max-w-2xl mt-3 leading-relaxed">
            We are committed to absolute transparency. Learn how Creators Kit safeguards your information, secures transactions, and guarantees zero third-party data selling.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-5 text-xs font-medium text-neutral-400">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-neutral-500" />
              Last Updated: {updatedAt}
            </span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 256-Bit TLS Bank Encryption
            </span>
          </div>
        </header>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 md:mb-12">
          <div className="bg-white dark:bg-[#131C2E] p-4 sm:p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-2xs flex flex-col items-start">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 flex items-center justify-center mb-2.5">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Encryption</span>
            <span className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white mt-0.5">256-Bit SSL</span>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 leading-snug">Bank-grade data transit security</p>
          </div>

          <div className="bg-white dark:bg-[#131C2E] p-4 sm:p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-2xs flex flex-col items-start">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 flex items-center justify-center mb-2.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Integrity</span>
            <span className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white mt-0.5">Zero Data Sale</span>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 leading-snug">Never sold or rented to 3rd parties</p>
          </div>

          <div className="bg-white dark:bg-[#131C2E] p-4 sm:p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-2xs flex flex-col items-start">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 flex items-center justify-center mb-2.5">
              <KeyRound className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Authentication</span>
            <span className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white mt-0.5">Bcrypt Hashes</span>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 leading-snug">Salted credentials & secure sessions</p>
          </div>

          <div className="bg-white dark:bg-[#131C2E] p-4 sm:p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-2xs flex flex-col items-start">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 flex items-center justify-center mb-2.5">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Privacy Rights</span>
            <span className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white mt-0.5">User Control</span>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 leading-snug">Full right to update or delete your data</p>
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
                    Information <span className="text-[#900606]">We Collect</span>
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    When you purchase studio equipment, browse gear, or create an account on <strong>Creators Kit (creatorskithub.com)</strong>, we collect necessary information to fulfill your orders and deliver your creator masterclasses:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm">
                    <li>
                      <strong>Contact & Shipping Data:</strong> Full name, verified email address, contact phone number, and physical delivery address (including city, state, and pin code).
                    </li>
                    <li>
                      <strong>Account Credentials:</strong> Email addresses and securely hashed passwords (processed through one-way salted bcrypt algorithms).
                    </li>
                    <li>
                      <strong>Order & Transaction Records:</strong> Purchased item SKUs, order values, transaction timestamps, and payment reference numbers. We <em>never</em> see or store your raw card numbers or UPI PINs.
                    </li>
                    <li>
                      <strong>Technical & Usage Information:</strong> Device type, browser user-agent, IP address, and cookie tokens strictly utilized for secure session persistence.
                    </li>
                  </ul>
                </div>
              </article>

              {/* Clause 2 */}
              <article className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                    02
                  </span>
                  <span>
                    How We Use <span className="text-[#900606]">Your Data</span>
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    We process your information strictly for legitimate commercial and fulfillment purposes:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2 text-xs sm:text-sm">
                    <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/70 dark:border-neutral-700/60">
                      <strong className="text-neutral-900 dark:text-white block mb-1">Order Fulfillment:</strong>
                      Processing payments, assembling creator bundles, generating tax invoices, and handing parcels to couriers.
                    </div>
                    <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/70 dark:border-neutral-700/60">
                      <strong className="text-neutral-900 dark:text-white block mb-1">Delivery Alerts:</strong>
                      Sending real-time dispatch updates, AWB tracking numbers, and delivery confirmation via SMS and Email.
                    </div>
                    <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/70 dark:border-neutral-700/60">
                      <strong className="text-neutral-900 dark:text-white block mb-1">Masterclass Access:</strong>
                      Unlocking bonus video masterclasses, tutorials, and downloadable presets in your student account dashboard.
                    </div>
                    <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/70 dark:border-neutral-700/60">
                      <strong className="text-neutral-900 dark:text-white block mb-1">Customer Support:</strong>
                      Resolving warranty claims, answering hardware questions, and coordinating 7-day replacements.
                    </div>
                  </div>
                </div>
              </article>

              {/* Clause 3 */}
              <article className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                    03
                  </span>
                  <span>
                    Data Sharing & <span className="text-[#900606]">Zero-Sale Commitment</span>
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Our Strict Guarantee:</strong> Creators Kit will <strong>NEVER</strong> sell, rent, monetize, or trade your personal information, phone number, or email to third-party advertisers, data aggregators, or brokers.
                    </div>
                  </div>
                  <p>
                    Data is shared strictly on a need-to-know basis with trusted operational partners:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm">
                    <li>
                      <strong>Logistics Partners:</strong> Delhivery, Bluedart, DTDC, and Xpressbees receive only your name, phone number, and delivery address to complete physical delivery.
                    </li>
                    <li>
                      <strong>Payment Gateways:</strong> PCI-DSS Level 1 compliant processors securely handle payment authorization.
                    </li>
                    <li>
                      <strong>Legal Authorities:</strong> Only when strictly required by enforceable court order or statutory Indian legal requirement.
                    </li>
                  </ul>
                </div>
              </article>

              {/* Clause 4 */}
              <article className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                    04
                  </span>
                  <span>
                    Security Protocols & <span className="text-[#900606]">Storage Protection</span>
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    We employ industry-leading infrastructure security protocols to ensure that your private information remains safeguarded against unauthorized access, alteration, or disclosure:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm">
                    <li>
                      <strong>Transport Layer Security:</strong> All data transmitted between your browser and our servers is secured with modern 256-bit TLS/SSL encryption.
                    </li>
                    <li>
                      <strong>Encrypted Databases:</strong> Customer profiles and orders are stored on isolated MongoDB clusters with firewalls, restricted IP access, and encryption at rest.
                    </li>
                    <li>
                      <strong>Session Token Security:</strong> Authentication tokens are signed with cryptographically strong secrets (`NEXTAUTH_SECRET`) and delivered via HTTP-only, SameSite cookies.
                    </li>
                  </ul>
                </div>
              </article>

              {/* Clause 5 */}
              <article className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                    05
                  </span>
                  <span>
                    Cookies & <span className="text-[#900606]">Session Storage</span>
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    We use cookies and browser storage strictly to ensure fundamental web store functionality:
                  </p>
                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/60 text-xs sm:text-sm space-y-1.5">
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#900606]" />
                      <strong>Session Cookies:</strong> Keeps you logged in as you navigate between products, cart, and masterclasses.
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#900606]" />
                      <strong>Cart Persistence:</strong> Remembers your chosen studio gear in your local cart so you don&apos;t lose items during checkout.
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#900606]" />
                      <strong>Theme Preference:</strong> Saves your dark or light mode setting across page refreshes.
                    </p>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    * We do not use third-party behavioral tracking or intrusive ad-retargeting pixels.
                  </p>
                </div>
              </article>

              {/* Clause 6 */}
              <article className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                    06
                  </span>
                  <span>
                    Your Rights & <span className="text-[#900606]">Data Deletion</span>
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    As a Creators Kit customer, you maintain complete ownership of your personal information:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm">
                    <li>
                      <strong>Right to Review:</strong> You can inspect all saved address and order records in your Account dashboard at any time.
                    </li>
                    <li>
                      <strong>Right to Update:</strong> You may edit your contact info or request address updates on active orders.
                    </li>
                    <li>
                      <strong>Right to Erasure (Account Deletion):</strong> You may request complete erasure of your account and personal identifiers by contacting our data protection officer at <a href="mailto:support@creatorskit.com" className="text-[#900606] font-bold hover:underline">support@creatorskit.com</a>.
                    </li>
                  </ul>
                </div>
              </article>
            </>
          )}

          {/* Dedicated Privacy Helpdesk Card */}
          <section className="bg-gradient-to-br from-white to-neutral-50 dark:from-[#131C2E] dark:to-[#0E1524] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#900606] uppercase tracking-wider">
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Data Protection Officer Desk</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white">
                  Have inquiries about how your data is handled?
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
                  Our privacy team is available to assist you with privacy inquiries, account data deletion, or compliance verification.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
                <a
                  href="mailto:support@creatorskit.com"
                  className="px-5 py-2.5 bg-[#900606] hover:bg-[#780505] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all text-center flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Contact Privacy Team</span>
                </a>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 font-bold text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 transition-all text-center flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Headphones className="w-4 h-4" />
                  <span>General Support</span>
                </Link>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-200/80 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
              <p>
                Privacy Officer: <a href="mailto:support@creatorskit.com" className="text-[#900606] font-semibold hover:underline">support@creatorskit.com</a>
              </p>
              <div className="flex items-center gap-4">
                <Link href="/terms" className="hover:text-[#900606] transition-colors flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>Terms of Service</span>
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
