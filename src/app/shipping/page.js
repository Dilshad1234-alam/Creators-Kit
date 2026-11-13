import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Policy from '@/models/Policy';
import {
  Truck,
  Clock,
  ShieldCheck,
  MapPin,
  Package,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Headphones,
  FileText,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Shipping Policy | Creators Kit',
  description:
    'Comprehensive Shipping & Delivery Policy for Creators Kit. Fast, insured pan-India delivery, order tracking, and courier timelines for studio equipment.',
};

export default async function ShippingPolicyPage() {
  let policy = null;
  try {
    await dbConnect();
    policy = await Policy.findOne({ key: 'shipping' }).lean();
  } catch (error) {
    console.warn('Failed to load shipping policy from database:', error.message);
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
            Shipping Policy
          </span>
        </nav>

        {/* Hero Header Section - Styling matched with Home "Shop by Category" */}
        <header className="flex flex-col items-center text-center mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 border border-red-200/60 dark:border-red-900/40 mb-4 shadow-2xs">
            <Truck className="w-3.5 h-3.5 text-[#900606] dark:text-red-400" />
            <span>Pan-India Fast Dispatch & Delivery</span>
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight">
            Shipping <span className="text-[#900606] whitespace-nowrap">Policy</span>
          </h1>

          <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base md:text-lg font-normal max-w-2xl mt-3 leading-relaxed">
            Transparent, insured, and dependable delivery across all 19,000+ pin codes in India for all your studio equipment, microphones, lights, and creator gear.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-5 text-xs font-medium text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              Last Updated: {updatedAt}
            </span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Express Courier Network
            </span>
          </div>
        </header>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 md:mb-12">
          <div className="bg-white dark:bg-[#131C2E] p-4 sm:p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-2xs flex flex-col items-start">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 flex items-center justify-center mb-2.5">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Speed</span>
            <span className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white mt-0.5">24-48h Dispatch</span>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 leading-snug">Quick packing and warehouse handover</p>
          </div>

          <div className="bg-white dark:bg-[#131C2E] p-4 sm:p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-2xs flex flex-col items-start">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 flex items-center justify-center mb-2.5">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Reach</span>
            <span className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white mt-0.5">19,000+ Pin Codes</span>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 leading-snug">Pan-India doorstep coverage</p>
          </div>

          <div className="bg-white dark:bg-[#131C2E] p-4 sm:p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-2xs flex flex-col items-start">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 flex items-center justify-center mb-2.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Security</span>
            <span className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white mt-0.5">100% Insured</span>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 leading-snug">Protected against transit damage</p>
          </div>

          <div className="bg-white dark:bg-[#131C2E] p-4 sm:p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-2xs flex flex-col items-start">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 flex items-center justify-center mb-2.5">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Tracking</span>
            <span className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white mt-0.5">Live Tracking</span>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 leading-snug">SMS, Email & WhatsApp updates</p>
          </div>
        </div>

        {/* Database Content (If Custom Overridden in Admin) OR Default Policy Articles */}
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
                    Order <span className="text-[#900606]">Processing</span> & Dispatch
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    All orders placed on <strong>creatorskithub.com</strong> undergo quality assurance inspection at our central fulfillment warehouse before packaging. Orders are typically processed and handed over to courier partners within <strong>24 to 48 business hours</strong> of payment confirmation.
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm">
                    <li>
                      <strong>Standard Processing Time:</strong> Monday to Saturday (10:00 AM – 7:00 PM IST).
                    </li>
                    <li>
                      <strong>Weekend & Holiday Orders:</strong> Orders placed on Sundays or gazetted national holidays are prepared for dispatch on the immediate next working day.
                    </li>
                    <li>
                      <strong>Custom Bundles / Pre-orders:</strong> If your order contains an item marked as <em>Pre-order</em> or custom assembly, dispatch dates will be clearly noted on the product page.
                    </li>
                  </ul>
                </div>
              </article>

              {/* Section 2 */}
              <article className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                    02
                  </span>
                  <span>
                    Pan-India <span className="text-[#900606]">Delivery Timelines</span>
                  </span>
                </h2>
                <p className="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed mb-4">
                  We partner exclusively with tier-1 logistics providers—including <strong>Bluedart, Delhivery, DTDC, Xpressbees, and Ekart</strong>—to ensure swift, secure doorstep delivery across India:
                </p>

                {/* Timelines Table / Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 my-4">
                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/60">
                    <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-red-100 text-[#900606] dark:bg-red-950/60 dark:text-red-300 uppercase tracking-wider mb-2">
                      Metro Cities
                    </span>
                    <h3 className="font-extrabold text-neutral-900 dark:text-white text-base">2 – 4 Working Days</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/60">
                    <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200 uppercase tracking-wider mb-2">
                      Tier 2 & 3 Cities
                    </span>
                    <h3 className="font-extrabold text-neutral-900 dark:text-white text-base">4 – 6 Working Days</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      State capitals, district headquarters, and major urban centers across all states.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/60">
                    <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200 uppercase tracking-wider mb-2">
                      Remote & Special Zones
                    </span>
                    <h3 className="font-extrabold text-neutral-900 dark:text-white text-base">6 – 9 Working Days</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      North East states, Jammu & Kashmir, Ladakh, Andaman & Nicobar, and island regions.
                    </p>
                  </div>
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal mt-3">
                  * Note: Severe weather events, local lockdowns, festival rush, or courier operational disruptions may occasionally introduce minor delays. Our support team actively monitors all in-transit parcels to ensure speedy resolution.
                </p>
              </article>

              {/* Section 3 */}
              <article className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                    03
                  </span>
                  <span>
                    Shipping <span className="text-[#900606]">Charges</span> & Free Delivery
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    We believe in 100% transparent pricing with zero surprise charges at checkout:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm">
                    <li>
                      <strong>Prepaid Orders:</strong> All prepaid orders (UPI, Cards, Netbanking) eligible for free shipping promotions will be delivered with zero shipping fees.
                    </li>
                    <li>
                      <strong>Standard Shipping:</strong> For smaller promotional orders below our free shipping threshold, a nominal flat rate of ₹49–₹99 is clearly shown at checkout before you make payment.
                    </li>
                    <li>
                      <strong>Cash on Delivery (COD):</strong> If Cash on Delivery is enabled for your pin code, a minimal verification handling charge may apply to offset return-to-origin courier costs.
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
                    Real-Time <span className="text-[#900606]">Order Tracking</span>
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    The moment your package is dispatched from our fulfillment center, you will receive an automated dispatch notification via <strong>Email and SMS / WhatsApp</strong> containing:
                  </p>
                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/60 text-xs sm:text-sm space-y-1.5">
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#900606]" />
                      <strong>Courier Partner Name</strong> (e.g. Bluedart, Delhivery, Xpressbees)
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#900606]" />
                      <strong>Air Waybill (AWB) Tracking Number</strong>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#900606]" />
                      <strong>Live Tracking URL</strong> for live GPS checkpoints
                    </p>
                  </div>
                  <p>
                    You can also track your parcel at any time directly through our website by visiting our dedicated{' '}
                    <Link
                      href="/track"
                      className="text-[#900606] font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Order Tracking Page</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>{' '}
                    with your Order ID or registered mobile number.
                  </p>
                </div>
              </article>

              {/* Section 5 */}
              <article className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                    05
                  </span>
                  <span>
                    Shockproof Packaging & <span className="text-[#900606]">Transit Insurance</span>
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    We know how sensitive creator gear is—from condenser microphones to studio ring lights and optical lenses. Every Creators Kit shipment is packed in <strong>heavy-duty, multi-layer corrugated boxes with high-density foam padding</strong> and tamper-evident security tape.
                  </p>
                  <div className="p-4 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#900606] shrink-0 mt-0.5" />
                    <div>
                      <strong>Inspection Upon Delivery:</strong> If you notice severe damage to the outer packaging or the security seal is broken, please record an unboxing video or capture clear photos before accepting the delivery. Contact our support team within <strong>24 hours</strong> so we can arrange an immediate replacement.
                    </div>
                  </div>
                </div>
              </article>

              {/* Section 6 */}
              <article className="bg-white dark:bg-[#131C2E] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-sm transition-all">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#900606] dark:text-red-400 text-xs sm:text-sm font-black border border-red-100 dark:border-red-900/50 shrink-0">
                    06
                  </span>
                  <span>
                    Address Corrections & <span className="text-[#900606]">RTO Shipments</span>
                  </span>
                </h2>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    Need to change your shipping address? Please contact us immediately at{' '}
                    <a
                      href="mailto:support@creatorskit.com"
                      className="text-[#900606] font-bold hover:underline"
                    >
                      support@creatorskit.com
                    </a>{' '}
                    with your Order ID. Once an order has been picked up by the courier partner and marked as <em>Dispatched</em>, destination address modifications may not be possible or could result in additional delivery delays.
                  </p>
                  <p>
                    In the event an order is returned to our fulfillment center due to an incomplete/incorrect address, customer unavailability after 3 attempted delivery attempts, or refusal of delivery, our team will reach out to schedule re-dispatch.
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
                  <span>Creators Kit Logistics Helpdesk</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white">
                  Have a question about your shipment?
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
                  Our dedicated shipping team is available Monday to Saturday, 10:00 AM – 7:00 PM IST to assist you with order status, address adjustments, and delivery coordination.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
                <Link
                  href="/track"
                  className="px-5 py-2.5 bg-[#900606] hover:bg-[#780505] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all text-center flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Package className="w-4 h-4" />
                  <span>Track Order</span>
                </Link>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 font-bold text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 transition-all text-center flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Headphones className="w-4 h-4" />
                  <span>Contact Support</span>
                </Link>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-200/80 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
              <p>
                Official Support: <a href="mailto:support@creatorskit.com" className="text-[#900606] font-semibold hover:underline">support@creatorskit.com</a>
              </p>
              <div className="flex items-center gap-4">
                <Link href="/refund" className="hover:text-[#900606] transition-colors flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" />
                  <span>Return & Refund Policy</span>
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

