import { DIMENSIONS } from "../constants";

interface AnimatedViewProps {
  show: boolean;
  children: React.ReactNode;
  isTransitioning: boolean;
}

export default function AnimatedView({
  show,
  children,
  isTransitioning,
}: AnimatedViewProps) {
  const visible = show && !isTransitioning;
  const translateX = DIMENSIONS.transform.translateX;
  return (
    <div
      style={{
        position: show ? "relative" : "absolute",
        top: 0,
        left: 0,
        right: 0,
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(0)"
          : show
          ? `translateX(${translateX})`
          : `translateX(-${translateX})`,
        transition: "opacity 0.3s ease, transform 0.3s ease",
        pointerEvents: show ? "auto" : "none",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}

