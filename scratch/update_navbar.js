const fs = require('fs');

let content = fs.readFileSync('src/components/Navbar.js', 'utf8');

// Replace Left Section
content = content.replace(
  /<div className="flex-shrink-0 flex items-center h-full">[\s\S]*?<\/Link>\s*<\/div>/,
  `<div className="flex-1 flex items-center justify-start h-full">
          <Link href="/" className="relative flex items-center group gap-2 md:gap-3">
            <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-full border-2 border-transparent group-hover:border-[#900606]/20 transition-colors">
              <Image
                src="/lo.png"
                alt="Creators Kit Logo"
                fill
                sizes="48px"
                className="object-cover transform transition-transform duration-300 group-hover:scale-110"
                priority
              />
            </div>
            <span className="font-black text-xl md:text-2xl tracking-tight text-neutral-900 dark:text-white">Creators<span className="text-[#900606]">kit</span></span>
          </Link>
        </div>`
);

// Update Desktop Navigation to be precisely centered by not being flex-1, just flex-shrink-0 (it's between two flex-1 containers)
// Currently: <nav className="hidden lg:flex items-center space-x-1">
// We can just leave it as is, or add flex-shrink-0
content = content.replace(
  /<nav className="hidden lg:flex items-center space-x-1">/,
  `<nav className="hidden lg:flex items-center justify-center space-x-1 flex-shrink-0">`
);

// Update Desktop Actions to use `flex-1 flex justify-end`
// Currently: <div className="hidden lg:flex items-center space-x-1 h-full">
content = content.replace(
  /<div className="hidden lg:flex items-center space-x-1 h-full">/,
  `<div className="flex-1 hidden lg:flex items-center justify-end space-x-1 h-full">`
);

// Mobile Right Actions:
// Currently: <div className="flex lg:hidden items-center space-x-2 h-full ml-auto mr-1">
content = content.replace(
  /<div className="flex lg:hidden items-center space-x-2 h-full ml-auto mr-1">/,
  `<div className="flex-1 flex justify-end lg:hidden items-center space-x-2 h-full mr-1">`
);

fs.writeFileSync('src/components/Navbar.js', content);
