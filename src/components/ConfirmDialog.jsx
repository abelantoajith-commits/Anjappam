import React from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'primary', // 'primary' | 'danger' | 'success'
  children,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-[#FFF8EE] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E8D9C5] animate-scaleUp text-[#3B2A1A]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#837564] hover:bg-[#FFEADA] hover:text-[#3B2A1A] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl shrink-0 ${
            type === 'danger'
              ? 'bg-[#FFDAD8] text-[#7A2E2E]'
              : type === 'success'
              ? 'bg-[#CCEEA0] text-[#5E7B3A]'
              : 'bg-[#FFEADA] text-[#845400]'
          }`}>
            {type === 'danger' && <AlertTriangle className="w-6 h-6" />}
            {type === 'success' && <CheckCircle className="w-6 h-6" />}
            {type === 'primary' && <Info className="w-6 h-6" />}
          </div>

          <div className="flex-1">
            <h3 id="modal-title" className="font-serif text-xl font-bold text-[#3B2A1A]">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-[#514536] mt-1 leading-relaxed">
                {description}
              </p>
            )}

            {children && <div className="mt-4">{children}</div>}

            <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#D6C4B1] text-sm font-semibold text-[#514536] hover:bg-[#FFEADA] transition-all"
              >
                {cancelText}
              </button>
              {onConfirm && (
                <button
                  type="button"
                  onClick={onConfirm}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-full text-sm font-semibold shadow-sm transition-all transform active:scale-95 ${
                    type === 'danger'
                      ? 'bg-[#7A2E2E] text-white hover:bg-[#984543]'
                      : 'bg-[#C98A2B] text-white hover:bg-[#845400]'
                  }`}
                >
                  {confirmText}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

