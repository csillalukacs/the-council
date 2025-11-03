import { useEffect, useRef } from "react";
import { STYLES, COLORS, SPACING, RADIUS, TYPOGRAPHY } from "../theme";

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
      style={STYLES.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        ref={modalContentRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          ...STYLES.modalContent,
          width: maxWidth,
          maxHeight: "80vh",
        }}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: SPACING.xl,
              right: SPACING.xl,
              ...STYLES.glassMedium,
              borderRadius: RADIUS.md,
              color: COLORS.primaryText,
              padding: `${SPACING.sm} ${SPACING.md}`,
              cursor: "pointer",
            }}
            aria-label="Close modal"
          >
            ✖ Close
          </button>
        )}
        {title && (
          <h2
            id="modal-title"
            style={{
              marginBottom: SPACING.xl,
              fontSize: TYPOGRAPHY.fontSize.xxl,
            }}
          >
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
