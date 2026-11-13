import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Policy from '@/models/Policy';
import {
  RotateCcw,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  CreditCard,
  Headphones,
  ChevronRight,
  FileText,
  Mail,
  HelpCircle,
  PackageCheck,
  XCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Return & Refund Policy | Creators Kit',
  description:
    'Comprehensive Return and Refund Policy for Creators Kit. Enjoy our 7-day hassle-free replacement guarantee, doorstep pickup, and fast refunds on creator gear.',
};

export default async function RefundPolicyPage() {
  let policy = null;
  try {
    await dbConnect();
    policy = await Policy.findOne({
      $or: [{ key: 'refund' }, { key: 'return' }],
    }).lean();
  } catch (error) {
    console.warn('Failed to load refund policy from database:', error.message);
  }

  const updatedAt = policy?.updatedAt
    ? new Date(policy.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'November 13, 2026';

  const rawContent = policy?.content;
  const dbParagraphs = rawContent ? rawContent.split('\n\n').filter(Boolean) : null;

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
            Return & Refund Policy
          </span>
        </nav>

        {/* Hero Header Section - Styling matched with Home "Shop by Category" */}
        <header className="flex flex-col items-center text-center mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 border border-red-200/60 dark:border-red-900/40 mb-4 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#900606] dark:text-red-400" />
            <span>100% Buyer Protection & Satisfaction Guarantee</span>
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight">
            Return & <span className="text-[#900606] whitespace-nowrap">Refund Policy</span>
          </h1>

          <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base md:text-lg font-normal max-w-2xl mt-3 leading-relaxed">
            Hassle-free 7-day replacement guarantee, transparent refund timelines, and doorstep reverse pickups for all genuine creator gear and equipment.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-5 text-xs font-medium text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              Last Updated: {updatedAt}
            </span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 7-Day Doorstep Replacement
            </span>
          </div>
        </header>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 md:mb-12">
          <div className="bg-white dark:bg-[#131C2E] p-4 sm:p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-2xs flex flex-col items-start">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 flex items-center justify-center mb-2.5">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Window</span>
            <span className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white mt-0.5">7-Day Guarantee</span>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 leading-snug">Replacement for defective or damaged items</p>
          </div>

          <div className="bg-white dark:bg-[#131C2E] p-4 sm:p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-2xs flex flex-col items-start">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 flex items-center justify-center mb-2.5">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Pickup</span>
            <span className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white mt-0.5">Doorstep Pickup</span>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 leading-snug">Courier picks up from your address</p>
          </div>

          <div className="bg-white dark:bg-[#131C2E] p-4 sm:p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-2xs flex flex-col items-start">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 flex items-center justify-center mb-2.5">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Payout</span>
            <span className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white mt-0.5">100% Refund</span>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 leading-snug">Direct back to payment mode or UPI</p>
          </div>

          <div className="bg-white dark:bg-[#131C2E] p-4 sm:p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-2xs flex flex-col items-start">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 flex items-center justify-center mb-2.5">
              <PackageCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Turnaround</span>
            <span className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white mt-0.5">48h Verification</span>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 leading-snug">Prompt inspection at our central hub</p>
          </div>
        </div>

        {/* Database Content OR Default Policy Articles */}
        <main className="space-y-6 sm:space-y-8">
          {dbParagraphs && dbParagraphs.length > 0 ? (
            dbParagraphs.map((paragraph, idx) => {
              const match = paragraph.match(/^(\d+\.\s*[^:\n]+):?\s*([\s\S]*)$/);
              if (match) {
                return (
                  <article
                    key={idx}
                    className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all"
                  >
                    <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span>{match[1]}</span>
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
              {/* Section 1 */}
              <article className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                    01
                  </span>
                  <span>
                    7-Day Hassle-Free <span className="text-[#900606]">Replacement Guarantee</span>
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    At <strong>Creators Kit (creatorskithub.com)</strong>, your creative satisfaction and confidence in your studio equipment are our highest priorities. We provide an uncompromising <strong>7-day replacement guarantee</strong> on all physical hardware products.
                  </p>
                  <p>
                    If your item arrives defective, damaged during transit, missing bundled accessories, or functionally non-operational, you can notify us within <strong>7 calendar days</strong> from the recorded delivery timestamp. We will arrange a prompt doorstep replacement or full refund.
                  </p>
                </div>
              </article>

              {/* Section 2 */}
              <article className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                    02
                  </span>
                  <span>
                    Eligibility Criteria for <span className="text-[#900606]">Gear Returns</span>
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    To ensure a seamless return or replacement process, returned items must comply with standard verification guidelines:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 my-2">
                    <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 text-xs sm:text-sm space-y-1.5">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 text-sm mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Eligible for Return / Replacement
                      </span>
                      <p className="text-neutral-700 dark:text-neutral-300">• Manufacturing defects or electrical failure upon arrival.</p>
                      <p className="text-neutral-700 dark:text-neutral-300">• Physical damage sustained during courier shipment.</p>
                      <p className="text-neutral-700 dark:text-neutral-300">• Incorrect model, color, or variant delivered.</p>
                      <p className="text-neutral-700 dark:text-neutral-300">• Unused product with original retail box, cables, and manuals intact.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/40 text-xs sm:text-sm space-y-1.5">
                      <span className="font-bold text-red-800 dark:text-red-300 flex items-center gap-1.5 text-sm mb-1">
                        <XCircle className="w-4 h-4 text-[#900606]" />
                        Ineligible for Return
                      </span>
                      <p className="text-neutral-700 dark:text-neutral-300">• Items damaged due to customer misuse, drops, or liquid spills.</p>
                      <p className="text-neutral-700 dark:text-neutral-300">• Products with altered, removed, or illegible serial numbers.</p>
                      <p className="text-neutral-700 dark:text-neutral-300">• Requests initiated after the 7-day delivery window has expired.</p>
                      <p className="text-neutral-700 dark:text-neutral-300">• Gear missing original retail packaging, stands, or warranty cards.</p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    * Tip: We strongly recommend recording a continuous 360-degree video while opening the parcel package. An unboxing video guarantees instant authorization of your replacement claim without bureaucratic delay.
                  </p>
                </div>
              </article>

              {/* Section 3 */}
              <article className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                    03
                  </span>
                  <span>
                    Non-Returnable Items & <span className="text-[#900606]">Digital Products</span>
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    Certain categories of products are non-returnable once delivered or accessed due to their digital nature:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm">
                    <li>
                      <strong>Creator Masterclasses & Digital Courses:</strong> Digital masterclasses, video tutorials, downloadable LUTs, preset packs, and software licenses that have been accessed or unlocked in your dashboard are strictly non-refundable.
                    </li>
                    <li>
                      <strong>Promotional Freebies & Gift Items:</strong> Any complimentary gift, promotional merchandise, or bonus assets included in a kit bundle cannot be exchanged or refunded separately.
                    </li>
                    <li>
                      <strong>Consumable Accessories:</strong> Adhesive mounts, opened foam windscreens, and acoustic panels that have had their protective film removed cannot be accepted for return.
                    </li>
                  </ul>
                </div>
              </article>

              {/* Section 4 */}
              <article className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                    04
                  </span>
                  <span>
                    Step-by-Step <span className="text-[#900606]">Return Workflow</span>
                  </span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
                  <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/70 dark:border-neutral-700/60 relative">
                    <span className="inline-block text-[11px] font-extrabold px-2 py-0.5 rounded bg-red-100 text-[#900606] dark:bg-red-950/60 dark:text-red-300 mb-2">
                      Step 1 • Request
                    </span>
                    <h3 className="font-extrabold text-[#111827] dark:text-white text-sm sm:text-base">
                      Contact Support
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                      Email us at{' '}
                      <a href="mailto:support@creatorskit.com" className="text-[#900606] font-bold hover:underline">
                        support@creatorskit.com
                      </a>{' '}
                      with your Order ID, a brief description of the issue, and photos or unboxing video.
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/70 dark:border-neutral-700/60 relative">
                    <span className="inline-block text-[11px] font-extrabold px-2 py-0.5 rounded bg-red-100 text-[#900606] dark:bg-red-950/60 dark:text-red-300 mb-2">
                      Step 2 • Verification
                    </span>
                    <h3 className="font-extrabold text-[#111827] dark:text-white text-sm sm:text-base">
                      Doorstep Pickup
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                      Our team validates your ticket within 24 business hours. We schedule a free reverse pickup right from your doorstep via our verified courier partner.
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/70 dark:border-neutral-700/60 relative">
                    <span className="inline-block text-[11px] font-extrabold px-2 py-0.5 rounded bg-red-100 text-[#900606] dark:bg-red-950/60 dark:text-red-300 mb-2">
                      Step 3 • Resolution
                    </span>
                    <h3 className="font-extrabold text-[#111827] dark:text-white text-sm sm:text-base">
                      Replacement or Refund
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                      Upon arrival and physical inspection at our central hub, a brand-new replacement unit is dispatched immediately or a 100% refund is initiated.
                    </p>
                  </div>
                </div>
              </article>

              {/* Section 5 */}
              <article className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                    05
                  </span>
                  <span>
                    Refund Methods & <span className="text-[#900606]">Settlement Timelines</span>
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    Once your return passes verification at our warehouse, your refund is approved and processed according to your original mode of payment:
                  </p>
                  
                  <div className="overflow-x-auto my-3">
                    <table className="w-full text-xs sm:text-sm text-left border-collapse border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                      <thead className="bg-neutral-100 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 uppercase text-[11px] font-bold">
                        <tr>
                          <th className="p-3 border-b border-neutral-200 dark:border-neutral-800">Payment Mode</th>
                          <th className="p-3 border-b border-neutral-200 dark:border-neutral-800">Refund Destination</th>
                          <th className="p-3 border-b border-neutral-200 dark:border-neutral-800">Estimated Settlement Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                        <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                          <td className="p-3 font-semibold text-neutral-900 dark:text-white">UPI (Google Pay, PhonePe, Paytm)</td>
                          <td className="p-3 text-neutral-600 dark:text-neutral-300">Original UPI ID / Linked Bank Account</td>
                          <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">24 – 48 Hours</td>
                        </tr>
                        <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                          <td className="p-3 font-semibold text-neutral-900 dark:text-white">Credit / Debit Card</td>
                          <td className="p-3 text-neutral-600 dark:text-neutral-300">Issuing Bank Account / Card Statement</td>
                          <td className="p-3 text-neutral-700 dark:text-neutral-300 font-semibold">5 – 7 Business Days</td>
                        </tr>
                        <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                          <td className="p-3 font-semibold text-neutral-900 dark:text-white">Netbanking / Wallets</td>
                          <td className="p-3 text-neutral-600 dark:text-neutral-300">Source Bank Account or Wallet Balance</td>
                          <td className="p-3 text-neutral-700 dark:text-neutral-300 font-semibold">3 – 5 Business Days</td>
                        </tr>
                        <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                          <td className="p-3 font-semibold text-neutral-900 dark:text-white">Cash on Delivery (COD)</td>
                          <td className="p-3 text-neutral-600 dark:text-neutral-300">Direct Bank Transfer (NEFT/IMPS) or UPI</td>
                          <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">24 – 48 Hours after verification</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    * Note: Refund timeline estimates are governed by respective clearing houses (RBI / NPCI) and your bank&apos;s settlement schedule.
                  </p>
                </div>
              </article>

              {/* Section 6 */}
              <article className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                    06
                  </span>
                  <span>
                    Order Cancellation <span className="text-[#900606]">Policy</span>
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    <strong>Before Shipment Dispatch:</strong> You may cancel any order before it is dispatched from our fulfillment center by reaching out to support with your Order ID. 100% of your paid amount will be reversed immediately with zero cancellation deductions.
                  </p>
                  <p>
                    <strong>After Shipment Dispatch:</strong> Once your package is handed over to the courier and assigned an AWB tracking number, it cannot be canceled mid-transit. You may simply refuse delivery when the courier executive arrives or accept the parcel and initiate a standard 7-day return.
                  </p>
                </div>
              </article>
            </>
          )}

          {/* Dedicated Support Card */}
          <section className="bg-gradient-to-br from-white to-neutral-50 dark:from-[#131C2E] dark:to-[#0E1524] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#900606] uppercase tracking-wider">
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Creators Kit Returns Helpdesk</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white">
                  Need to initiate a replacement or check refund status?
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
                  Our customer care team is here to help you get your gear working perfectly. Send your Order ID and query, and we will get back to you promptly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
                <a
                  href="mailto:support@creatorskit.com"
                  className="px-5 py-2.5 bg-[#900606] hover:bg-[#780505] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all text-center flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Support</span>
                </a>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 font-bold text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 transition-all text-center flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Headphones className="w-4 h-4" />
                  <span>Contact Page</span>
                </Link>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-200/80 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
              <p>
                Support Hours: Monday – Saturday (10:00 AM – 7:00 PM IST)
              </p>
              <div className="flex items-center gap-4">
                <Link href="/shipping" className="hover:text-[#900606] transition-colors flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  <span>Shipping Policy</span>
                </Link>
                <Link href="/terms" className="hover:text-[#900606] transition-colors flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>Terms & Conditions</span>
                </Link>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

