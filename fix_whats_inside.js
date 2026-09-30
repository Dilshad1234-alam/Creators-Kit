const fs = require('fs');

// Fix WhatsInsideManager.js UI issues
const path = 'src/components/admin/WhatsInsideManager.js';
let content = fs.readFileSync(path, 'utf8');

// Fix modal backdrop and inner container
const oldModalContainer = `{isModalOpen && (
 <div className="fixed inset-0 z-[9999] flex items-center justify-center">
 <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
 <div className="relative bg-[#FDFBF7] border border-neutral-200 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">`;

const newModalContainer = `{isModalOpen && (
 <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
 <div className="relative w-full max-w-2xl mx-4 bg-white border border-neutral-200 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">`;

content = content.replace(oldModalContainer, newModalContainer);

// Fix text color on button
content = content.replace(
  'className="px-8 py-3 bg-[#900606] hover:bg-[#900606]/80 disabled:opacity-50 text-[#900606] font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center gap-2"',
  'className="px-8 py-3 bg-[#900606] hover:bg-[#900606]/80 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center gap-2"'
);

fs.writeFileSync(path, content);
console.log('Fixed WhatsInsideManager UI');
