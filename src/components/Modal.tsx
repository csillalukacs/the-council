import { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "90vw",
  showCloseButton = true,
}: ModalProps) {
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Trap focus within modal
      const firstFocusable = modalContentRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        ref={modalContentRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: maxWidth,
          maxHeight: "90vh",
          background: "rgba(15,25,35,0.95)",
          border: "1px solid rgba(102,204,255,0.4)",
          borderRadius: "10px",
          color: "#ccf6ff",
          overflowY: "auto",
          padding: "24px",
          boxShadow: "0 0 20px rgba(102,204,255,0.3)",
          backdropFilter: "blur(6px)",
          position: "relative",
        }}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "rgba(102,204,255,0.15)",
              color: "#ccf6ff",
              border: "1px solid rgba(102,204,255,0.4)",
              borderRadius: "6px",
              padding: "6px 10px",
              cursor: "pointer",
              backdropFilter: "blur(6px)",
            }}
            aria-label="Close modal"
          >
            ✖ Close
          </button>
        )}
        {title && (
          <h2
            id="modal-title"
            style={{ marginBottom: "16px", fontSize: "20px" }}
          >
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}

