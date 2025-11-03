import { useState } from "react";
import Modal from "./components/Modal";
import HistoryButton from "./components/HistoryButton";
import HistoryModalContent from "./components/HistoryModalContent";
import { DIMENSIONS, TIMING } from "./constants";
import {
  getStoredConversations,
  saveConversations,
} from "./utils/conversationStorage";
import type { Conversation } from "./types";

export default function History() {
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<Conversation[]>([]);
  const [openedConversation, setOpenedConversation] = useState<number | null>(
    null
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionTo = (index: number | null) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setOpenedConversation(index);
      setIsTransitioning(false);
    }, TIMING.animation.historyTransition);
  };

  const viewHistory = () => {
    setHistory(getStoredConversations());
    setShowHistory(true);
    setOpenedConversation(null);
  };

  const deleteConversation = (reversedIndex: number) => {
    const saved = getStoredConversations();
    saved.splice(saved.length - 1 - reversedIndex, 1);
    saveConversations(saved);
    setHistory(saved);
  };

  const handleCloseModal = () => {
    setShowHistory(false);
    setOpenedConversation(null);
    setIsTransitioning(false);
  };

  return (
    <div>
      <HistoryButton onClick={viewHistory} />

      <Modal
        isOpen={showHistory}
        onClose={handleCloseModal}
        title={openedConversation === null ? "Conversation History" : undefined}
        maxWidth={DIMENSIONS.modal.maxWidth.history}
      >
        <HistoryModalContent
          history={history}
          openedConversation={openedConversation}
          isTransitioning={isTransitioning}
          onConversationClick={(index) => transitionTo(index)}
          onDeleteConversation={deleteConversation}
          onBack={() => transitionTo(null)}
        />
      </Modal>
    </div>
  );
}
