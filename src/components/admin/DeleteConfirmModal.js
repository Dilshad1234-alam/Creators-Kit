'use client';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Confirmation',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmText = 'Yes, Delete',
  cancelText = 'No, Cancel',
  isDeleting = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={!isDeleting ? onClose : undefined}
      />
      <div className="relative bg-white border border-neutral-200/90 rounded-2xl shadow-2xl p-6 sm:p-7 max-w-sm w-full text-center space-y-4 z-10">
        
        {/* Warning / Trash Icon */}
        <div className="w-12 h-12 rounded-full bg-red-50 text-[#DC2626] border border-red-100 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>

        {/* Content */}
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-neutral-900 tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-neutral-500 leading-relaxed mt-1.5 px-2">
            {message}
          </p>
        </div>

        {/* Action Buttons: Yes or No */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#C81E1E] text-white text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50 active:scale-98 flex items-center justify-center gap-1.5"
          >
            {isDeleting ? (
              <span>Deleting...</span>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
