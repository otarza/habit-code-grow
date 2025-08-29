import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TallyModalProps {
  isOpen: boolean;
  onClose: () => void;
  formUrl: string;
  title?: string;
}

export function TallyModal({ isOpen, onClose, formUrl, title = "დაჯავშნე შენი ადგილი" }: TallyModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container with scrollable area */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full animate-in fade-in-0 zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-secondary/5">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full w-8 h-8 p-0 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Tally Form - Responsive height */}
          <div className="h-[50vh] sm:h-[60vh] md:h-[600px] overflow-auto -webkit-overflow-scrolling-touch">
            <iframe
              src={formUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title={title}
              className="rounded-b-2xl"
              style={{
                background: 'transparent',
                border: 'none',
                minHeight: '500px'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for easy form management
export function useTallyModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  
  return {
    isOpen,
    openModal,
    closeModal
  };
}