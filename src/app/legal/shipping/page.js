export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0B0D0E] text-zinc-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1 className="text-4xl font-extrabold mb-8 text-[#FF3B14]">Shipping Policy</h1>
        
        <div className="space-y-6 text-zinc-400 leading-relaxed">
          <h2 className="text-2xl font-bold text-zinc-100 mt-8 mb-4">Processing Time</h2>
          <p>All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>
          
          <h2 className="text-2xl font-bold text-zinc-100 mt-8 mb-4">Domestic Shipping Rates and Estimates</h2>
          <p><strong>Free Standard Shipping:</strong> We offer free standard shipping on all Creators Kit bundles nationwide. Standard shipping typically takes 3-5 business days.</p>
          <p><strong>Expedited Shipping:</strong> Expedited shipping (1-2 business days) is available at checkout for an additional fee calculated by our carriers.</p>
          
          <h2 className="text-2xl font-bold text-zinc-100 mt-8 mb-4">International Shipping</h2>
          <p>At this time, we only ship domestically. We are working hard to expand our logistics to support international creators soon.</p>

          <h2 className="text-2xl font-bold text-zinc-100 mt-8 mb-4">How do I check the status of my order?</h2>
          <p>When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.</p>
        </div>
      </div>
    </div>
  );
}
