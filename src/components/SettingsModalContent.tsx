import { SPACING, TYPOGRAPHY, STYLES, RADIUS } from "../theme";
import ModelSelector from "./ModelSelector";

interface SettingsModalContentProps {
  members: Array<{ id: string; displayName: string; color: string }>;
  models: string[];
  freeModels: string[];
  paidModels: string[];
  loadingModels: boolean;
  onModelChange: (index: number, value: string) => void;
  onAllModelsChange: (value: string) => void;
  onShuffle: () => void;
}

export default function SettingsModalContent({
  members,
  models,
  freeModels,
  paidModels,
  loadingModels,
  onModelChange,
  onAllModelsChange,
  onShuffle,
}: SettingsModalContentProps) {
  const allModelsSame = models.every((model) => model === models[0]);
  const currentAllModel = allModelsSame ? models[0] : "";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: SPACING.lg,
        paddingTop: SPACING.xs,
        paddingBottom: SPACING.xxl,
      }}
    >
      {/* Change All selector */}
      <div
        style={{
          fontSize: TYPOGRAPHY.fontSize.sm,
          paddingBottom: SPACING.lg,
          borderBottom: "1px solid rgba(102, 204, 255, 0.2)",
        }}
      >
        <div style={{ marginBottom: SPACING.xs, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: TYPOGRAPHY.fontWeight.bold }}>
            All Members
          </span>
          <button
            onClick={onShuffle}
            disabled={loadingModels}
            style={{
              ...STYLES.button,
              padding: `2px ${SPACING.sm}`,
              fontSize: TYPOGRAPHY.fontSize.sm,
              opacity: loadingModels ? 0.5 : 1,
              cursor: loadingModels ? "not-allowed" : "pointer",
            }}
          >
            ⇄ shuffle
          </button>
        </div>
        <select
          value={currentAllModel}
          onChange={(e) => onAllModelsChange(e.target.value)}
          style={{
            width: "100%",
            ...STYLES.select,
            borderRadius: RADIUS.sm,
            padding: SPACING.xs,
          }}
        >
          {!allModelsSame && (
            <option value="" disabled>
              (Mixed)
            </option>
          )}
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

      {/* Individual member selectors — 2-column grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: SPACING.lg,
        }}
      >
        {members.map((member, i) => (
          <ModelSelector
            key={member.id}
            member={member}
            model={models[i]}
            freeModels={freeModels}
            paidModels={paidModels}
            loadingModels={loadingModels}
            onModelChange={(value) => onModelChange(i, value)}
          />
        ))}
      </div>
    </div>
  );
}
