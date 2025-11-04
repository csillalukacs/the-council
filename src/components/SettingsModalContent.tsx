import { AVAILABLE_MODELS, DIMENSIONS } from "../constants";
import { SPACING, TYPOGRAPHY, STYLES, RADIUS } from "../theme";
import ModelSelector from "./ModelSelector";

interface SettingsModalContentProps {
  members: Array<{ id: string; displayName: string; color: string }>;
  models: string[];
  onModelChange: (index: number, value: string) => void;
  onAllModelsChange: (value: string) => void;
}

export default function SettingsModalContent({
  members,
  models,
  onModelChange,
  onAllModelsChange,
}: SettingsModalContentProps) {
  // Check if all models are the same
  const allModelsSame = models.every((model) => model === models[0]);
  const currentAllModel = allModelsSame ? models[0] : "";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: SPACING.lg,
        paddingLeft: DIMENSIONS.settings.padding.left,
        paddingRight: DIMENSIONS.settings.padding.right,
        paddingTop: DIMENSIONS.settings.padding.top,
        paddingBottom: DIMENSIONS.settings.padding.bottom,
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
        <div style={{ marginBottom: SPACING.xs }}>
          <span style={{ fontWeight: TYPOGRAPHY.fontWeight.bold }}>
            All Members
          </span>
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
          {AVAILABLE_MODELS.map((availableModel) => (
            <option key={availableModel} value={availableModel}>
              {availableModel}
            </option>
          ))}
        </select>
      </div>

      {/* Individual member selectors */}
      {members.map((member, i) => (
        <ModelSelector
          key={member.id}
          member={member}
          model={models[i]}
          onModelChange={(value) => onModelChange(i, value)}
        />
      ))}
    </div>
  );
}
