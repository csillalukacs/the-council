import { useEffect, useRef, useState } from "react";
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
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      setShouldRender(true);
      // Trigger animation after render - use double RAF to ensure DOM is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
      document.addEventListener("keydown", handleEscape);
      // Trap focus within modal - delay to ensure element is rendered
      setTimeout(() => {
        const firstFocusable = modalContentRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        firstFocusable?.focus();
      }, 0);
    } else {
      setIsAnimating(false);
      // Delay unmounting to allow exit animation
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200); // Match animation duration
      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleEscape);
      };
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        ...STYLES.modalOverlay,
        opacity: isAnimating ? 1 : 0,
        transition: "opacity 0.2s ease-out",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        ref={modalContentRef}
        onClick={(e) => e.stopPropagation()}
        className="modal-content"
        style={{
          ...STYLES.modalContent,
          width: maxWidth,
          maxHeight: "80vh",
          opacity: isAnimating ? 1 : 0,
          transform: isAnimating
            ? "scale(1) translateY(0)"
            : "scale(0.1) translateY(-10px)",
          transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
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
