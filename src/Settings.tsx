import { useState } from "react";
import Modal from "./components/Modal";
import {
  AVAILABLE_MODELS,
  STORAGE_KEYS,
  DIMENSIONS,
  Z_INDEX,
} from "./constants";
import { SPACING, TYPOGRAPHY, RADIUS, STYLES } from "./theme";

export default function Settings({
  models,
  setModels,
  members,
}: {
  models: string[];
  setModels: React.Dispatch<React.SetStateAction<string[]>>;
  members: Array<{ id: string; displayName: string; color: string }>;
}) {
  const [showSettings, setShowSettings] = useState(false);

  const handleModelChange = (index: number, value: string) => {
    const updated = [...models];
    updated[index] = value;
    setModels(updated);
    localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(updated));
  };

  return (
    <>
      <button
        onClick={() => setShowSettings((s) => !s)}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: Z_INDEX.settings,
          ...STYLES.settingsButton,
          borderRadius: RADIUS.lg,
          padding: `${SPACING.sm} ${SPACING.md}`,
          cursor: "pointer",
        }}
        aria-label="Open settings"
      >
        ⚙️
      </button>

      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Models"
        maxWidth={DIMENSIONS.modal.maxWidth.settings}
      >
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
            <div
              key={member.id}
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
                value={models[i]}
                onChange={(e) => handleModelChange(i, e.target.value)}
                style={{
                  width: "100%",
                  ...STYLES.select,
                  borderRadius: RADIUS.sm,
                  padding: SPACING.xs,
                }}
              >
                {AVAILABLE_MODELS.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
