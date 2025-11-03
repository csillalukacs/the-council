import { AVAILABLE_MODELS } from "../constants";
import { TYPOGRAPHY, SPACING, STYLES, RADIUS } from "../theme";

interface ModelSelectorProps {
  member: { id: string; displayName: string; color: string };
  model: string;
  onModelChange: (value: string) => void;
}

export default function ModelSelector({
  member,
  model,
  onModelChange,
}: ModelSelectorProps) {
  return (
    <div
      style={{
        fontSize: TYPOGRAPHY.fontSize.sm,
      }}
    >
      <div style={{ marginBottom: SPACING.xs }}>
        <span
          style={{
            color: member.color,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            marginRight: SPACING.xs,
          }}
        >
          ●
        </span>
        <span>{member.displayName}</span>
      </div>
      <select
        value={model}
        onChange={(e) => onModelChange(e.target.value)}
        style={{
          width: "100%",
          ...STYLES.select,
          borderRadius: RADIUS.sm,
          padding: SPACING.xs,
        }}
      >
        {AVAILABLE_MODELS.map((availableModel) => (
          <option key={availableModel} value={availableModel}>
            {availableModel}
          </option>
        ))}
      </select>
    </div>
  );
}

