import { useEffect, useState } from "react";
import { STYLES, COLORS, SPACING, RADIUS, TYPOGRAPHY } from "../theme";
import { TIMING, DIMENSIONS } from "../constants";

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
    } else {
      setIsAnimating(false);
      // Delay unmounting to allow exit animation
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, TIMING.animation.modal);
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
        transition: `opacity ${TIMING.animation.modal}ms ease-out`,
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content"
        style={{
          ...STYLES.modalContent,
          width: maxWidth,
          maxHeight: DIMENSIONS.modal.maxHeight,
          opacity: isAnimating ? 1 : 0,
          transform: isAnimating
            ? "scale(1) translateY(0)"
            : `scale(${DIMENSIONS.transform.scale.initial}) translateY(${DIMENSIONS.transform.scale.translateY})`,
          transition: `opacity ${TIMING.animation.modal}ms ease-out, transform ${TIMING.animation.modal}ms ease-out`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: 0,
        }}
      >
        {/* Fixed header section */}
        <div
          style={{
            position: "relative",
            padding: SPACING.xxxl,
            paddingBottom: title ? SPACING.xl : SPACING.xxxl,
            flexShrink: 0,
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
                zIndex: 150,
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
                margin: 0,
                fontSize: TYPOGRAPHY.fontSize.xxl,
                paddingRight: showCloseButton ? "80px" : 0,
              }}
            >
              {title}
            </h2>
          )}
        </div>

        {/* Scrollable content section */}
        <div
          className="modal-content-scrollable"
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            paddingLeft: SPACING.xxxl,
            paddingRight: SPACING.xxxl,
            paddingBottom: SPACING.xxxl,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
