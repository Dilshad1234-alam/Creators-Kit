import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 text-center">
        <div className="bg-zinc-900/80 backdrop-blur-xl p-8 rounded-3xl border border-zinc-800 shadow-2xl">
          <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-zinc-400 mb-8">
            Thank you for your purchase. Your Creators Kit is ready for download and shipment.
          </p>

          <div className="bg-[#0d0d0d]/50 rounded-2xl p-5 mb-8 border border-zinc-800/50 text-left">
            <div className="flex justify-between items-center mb-3">
              <span className="text-zinc-500 text-sm">Order Number</span>
              <span className="text-zinc-200 font-mono text-sm">#CK-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-zinc-500 text-sm">Amount Paid</span>
              <span className="text-zinc-200 font-medium">₹3,999</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-sm">Payment Status</span>
              <span className="text-green-400 font-medium text-sm flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                Successful
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="block w-full py-3.5 px-4 bg-[#FF3B14] hover:bg-[#E01A00] text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(252,29,0,0.3)] hover:shadow-[0_0_30px_rgba(252,29,0,0.5)] active:scale-[0.98]"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
