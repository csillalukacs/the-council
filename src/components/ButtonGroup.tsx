import { Z_INDEX } from "../constants";
import { SPACING } from "../theme";

interface ButtonGroupProps {
  children: React.ReactNode;
}

export default function ButtonGroup({ children }: ButtonGroupProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: Z_INDEX.settings,
        display: "flex",
        gap: SPACING.sm,
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
}
