import { useState } from "react";
import Modal from "./components/Modal";
import SettingsButton from "./components/SettingsButton";
import SettingsModalContent from "./components/SettingsModalContent";
import { STORAGE_KEYS, DIMENSIONS } from "./constants";

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
      <SettingsButton onClick={() => setShowSettings((s) => !s)} />

      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Models"
        maxWidth={DIMENSIONS.modal.maxWidth.settings}
      >
        <SettingsModalContent
          members={members}
          models={models}
          onModelChange={handleModelChange}
        />
      </Modal>
    </>
  );
}
