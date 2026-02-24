import { TYPOGRAPHY, SPACING, STYLES, RADIUS } from "../theme";

interface ModelSelectorProps {
  member: { id: string; displayName: string; color: string };
  model: string;
  freeModels: string[];
  paidModels: string[];
  loadingModels: boolean;
  onModelChange: (value: string) => void;
}

export default function ModelSelector({
  member,
  model,
  freeModels,
  paidModels,
  loadingModels,
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
        <optgroup label={loadingModels ? "Free Models (loading...)" : "Free Models"}>
          {freeModels.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </optgroup>
        <optgroup label="Paid Models">
          {paidModels.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}
