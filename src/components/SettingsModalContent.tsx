import { DIMENSIONS } from "../constants";
import { SPACING } from "../theme";
import ModelSelector from "./ModelSelector";

interface SettingsModalContentProps {
  members: Array<{ id: string; displayName: string; color: string }>;
  models: string[];
  onModelChange: (index: number, value: string) => void;
}

export default function SettingsModalContent({
  members,
  models,
  onModelChange,
}: SettingsModalContentProps) {
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
