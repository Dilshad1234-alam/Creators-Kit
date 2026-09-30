const fs = require('fs');

// 1. Fix missing sizes prop in ProductsManager.js
const prodPath = 'src/components/admin/ProductsManager.js';
let prodContent = fs.readFileSync(prodPath, 'utf8');
prodContent = prodContent.replace(
  '<Image src={p.image} alt={p.name} fill className="object-contain p-1" />',
  '<Image src={p.image} alt={p.name} fill sizes="48px" className="object-contain p-1" />'
);
fs.writeFileSync(prodPath, prodContent);

// 2. Fix missing sizes prop in WhatsInsideManager.js
const whatsPath = 'src/components/admin/WhatsInsideManager.js';
let whatsContent = fs.readFileSync(whatsPath, 'utf8');
whatsContent = whatsContent.replace(
  '<Image src={p.image} alt={p.name} fill className="object-contain p-1" />',
  '<Image src={p.image} alt={p.name} fill sizes="48px" className="object-contain p-1" />'
);
fs.writeFileSync(whatsPath, whatsContent);

console.log('Fixed missing sizes props');
