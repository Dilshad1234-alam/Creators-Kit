export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 w-full font-sans overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative w-full pt-24 pb-32 bg-zinc-950">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-50/80 via-transparent to-transparent pointer-events-none"></div>
        <div className="w-full px-6 md:px-12 lg:px-24 relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 text-xs font-bold mb-8 border border-red-500/20 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-[#FC1D00] animate-pulse"></span>
            Empowering the next generation
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-zinc-100 leading-[1.1] max-w-4xl mx-auto">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FC1D00] to-orange-500">Creators Kit</span>
          </h1>
          <p className="max-w-3xl text-xl md:text-2xl text-zinc-400 leading-relaxed font-medium mx-auto">
            We believe that high-quality content creation should be accessible to everyone. 
            No more endless research, incompatible gear, or confusing tutorials.
          </p>
        </div>
      </section>

      {/* Mission Statement & Story */}
      <section className="w-full py-24 bg-zinc-900 text-zinc-100 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        
        <div className="w-full px-6 md:px-12 lg:px-24 mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight text-white">Our Mission</h2>
            <div className="w-20 h-2 bg-[#FC1D00] mb-8 rounded-full"></div>
            <p className="text-xl md:text-2xl text-neutral-400 font-medium leading-relaxed">
              To eliminate the technical barriers of content creation, allowing you to focus entirely on your message, your art, and your audience.
            </p>
          </div>

          <div className="bg-zinc-950/50 backdrop-blur-xl p-10 md:p-12 rounded-[3rem] border border-zinc-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FC1D00]/10 rounded-full blur-[80px] group-hover:bg-[#FC1D00]/20 transition-colors duration-700"></div>
            <h3 className="text-3xl font-bold mb-6 text-zinc-100 relative z-10">The Story</h3>
            <p className="text-neutral-400 leading-relaxed mb-6 font-medium relative z-10">
              Creators Kit was born out of a simple frustration: starting a YouTube channel, podcast, or TikTok page is overwhelming. You spend weeks researching what camera to buy, what microphone sounds best, and how to light your room, only to realize you still don't know how to edit the footage.
            </p>
            <p className="text-neutral-400 leading-relaxed font-medium relative z-10">
              We realized that creators don't just need gear; they need an <strong className="text-white">ecosystem</strong>. They need the hardware to record, the software knowledge to edit, and the strategies to publish and grow. 
            </p>
          </div>
        </div>
      </section>

      {/* The Ecosystem (Core Philosophy) */}
      <section className="w-full py-32 bg-zinc-950 border-t border-zinc-900">
        <div className="w-full px-6 md:px-12 lg:px-24">
          <div className="text-center mb-20 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight text-zinc-100">The Creator Ecosystem</h2>
            <p className="text-xl md:text-2xl text-zinc-400 font-medium">The three pillars that guarantee your success.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Equipment */}
            <div className="bg-zinc-900 p-10 lg:p-12 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-red-500/10 border border-zinc-800 hover:border-[#FC1D00]/50 transition-all duration-300 group flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-zinc-950 rounded-full flex items-center justify-center text-5xl mb-8 shadow-md border border-zinc-800 group-hover:-translate-y-2 group-hover:scale-110 transition-transform duration-300">
                🎥
              </div>
              <h3 className="text-2xl font-extrabold mb-4 text-zinc-100">Equipment</h3>
              <p className="text-lg text-zinc-400 font-medium">Professional-grade, plug-and-play hardware curated to work perfectly together right out of the box.</p>
            </div>
            
            {/* Education */}
            <div className="bg-zinc-900 p-10 lg:p-12 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-red-500/10 border border-zinc-800 hover:border-[#FC1D00]/50 transition-all duration-300 group flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-zinc-950 rounded-full flex items-center justify-center text-5xl mb-8 shadow-md border border-zinc-800 group-hover:-translate-y-2 group-hover:scale-110 transition-transform duration-300">
                🧠
              </div>
              <h3 className="text-2xl font-extrabold mb-4 text-zinc-100">Education</h3>
              <p className="text-lg text-zinc-400 font-medium">Included mastery courses for YouTube, Instagram, and Filmora to help you maximize your gear.</p>
            </div>
            
            {/* Resources */}
            <div className="bg-zinc-900 p-10 lg:p-12 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-red-500/10 border border-zinc-800 hover:border-[#FC1D00]/50 transition-all duration-300 group flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-zinc-950 rounded-full flex items-center justify-center text-5xl mb-8 shadow-md border border-zinc-800 group-hover:-translate-y-2 group-hover:scale-110 transition-transform duration-300">
                📑
              </div>
              <h3 className="text-2xl font-extrabold mb-4 text-zinc-100">Resources</h3>
              <p className="text-lg text-zinc-400 font-medium">Physical pendrives for offline learning and printed project workbooks for hands-on, tactile mastery.</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
