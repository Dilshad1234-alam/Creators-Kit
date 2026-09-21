export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-neutral-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1 className="text-4xl font-extrabold mb-8 text-primary">Privacy Policy</h1>
        <p className="text-neutral-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-6 text-neutral-400 leading-relaxed">
          <p>At Creators Kit, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our website.</p>
          
          <h2 className="text-2xl font-bold text-neutral-100 mt-8 mb-4">Information We Collect</h2>
          <p>When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.</p>
          <p>Additionally, when you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, payment information, email address, and phone number. We refer to this information as "Order Information".</p>
          
          <h2 className="text-2xl font-bold text-neutral-100 mt-8 mb-4">How We Use Your Information</h2>
          <p>We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).</p>
          
          <h2 className="text-2xl font-bold text-neutral-100 mt-8 mb-4">Sharing Your Information</h2>
          <p>We share your Personal Information with third parties to help us use your Personal Information, as described above. We also use Google Analytics to help us understand how our customers use the Site.</p>
        </div>
      </div>
    </div>
  );
}
