import Modal from "./components/Modal";
import SettingsModalContent from "./components/SettingsModalContent";
import { STORAGE_KEYS, DIMENSIONS } from "./constants";

export default function Settings({
  models,
  setModels,
  members,
  showSettings,
  setShowSettings,
}: {
  models: string[];
  setModels: React.Dispatch<React.SetStateAction<string[]>>;
  members: Array<{ id: string; displayName: string; color: string }>;
  showSettings: boolean;
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleModelChange = (index: number, value: string) => {
    const updated = [...models];
    updated[index] = value;
    setModels(updated);
    localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(updated));
  };

  const handleAllModelsChange = (value: string) => {
    const updated = models.map(() => value);
    setModels(updated);
    localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(updated));
  };

  return (
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
        onAllModelsChange={handleAllModelsChange}
      />
    </Modal>
  );
}
