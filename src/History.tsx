import { useState } from "react";
import Modal from "./components/Modal";
import HistoryListView from "./components/HistoryListView";
import ConversationView from "./components/ConversationView";
import { STORAGE_KEYS } from "./constants";
import { STYLES, SPACING } from "./theme";
import type { Conversation } from "./types";

export default function History() {
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<Conversation[]>([]);
  const [openedConversation, setOpenedConversation] = useState<number | null>(
    null
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  const viewHistory = () => {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || "[]"
    );
    setHistory(saved);
    setShowHistory(true);
    setOpenedConversation(null);
  };

  const openConversation = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setOpenedConversation(index);
      setIsTransitioning(false);
    }, 150);
  };

  const closeConversation = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setOpenedConversation(null);
      setIsTransitioning(false);
    }, 150);
  };

  const deleteConversation = (reversedIndex: number) => {
    console.log("deleteConversation", reversedIndex);
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || "[]"
    );

    // Convert reversed index to actual index (history is displayed reversed)
    const actualIndex = saved.length - 1 - reversedIndex;

    // Remove the conversation
    saved.splice(actualIndex, 1);
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(saved));

    // Update local state
    setHistory(saved);

    // Close conversation view if the deleted conversation was open
    if (openedConversation === reversedIndex) {
      closeConversation();
    } else if (
      openedConversation !== null &&
      openedConversation > reversedIndex
    ) {
      // Adjust opened conversation index if needed
      // (since we removed an item before it in the reversed list)
      setOpenedConversation(openedConversation - 1);
    }
  };

  const handleCloseModal = () => {
    setShowHistory(false);
    setOpenedConversation(null);
    setIsTransitioning(false);
  };

  return (
    <div>
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          zIndex: 10,
        }}
      >
        <button
          onClick={viewHistory}
          style={{
            ...STYLES.glass,
            padding: `${SPACING.md} ${SPACING.lg}`,
            marginLeft: SPACING.md,
          }}
        >
          📜 View History
        </button>
      </div>

      <Modal
        isOpen={showHistory}
        onClose={handleCloseModal}
        title={openedConversation !== null ? undefined : "Conversation History"}
        maxWidth="70vw"
      >
        <div
          style={{
            position: "relative",
            minHeight: "300px",
            overflow: "hidden",
          }}
        >
          {/* History List View */}
          <AnimatedView
            show={openedConversation === null}
            isTransitioning={isTransitioning}
          >
            <HistoryListView
              history={history}
              onConversationClick={openConversation}
              onDeleteConversation={deleteConversation}
            />
          </AnimatedView>

          {/* Conversation View */}
          <AnimatedView
            show={openedConversation !== null}
            isTransitioning={isTransitioning}
          >
            {openedConversation !== null && (
              <ConversationView
                conversation={history[history.length - 1 - openedConversation]}
                onBack={closeConversation}
              />
            )}
          </AnimatedView>
        </div>
      </Modal>
    </div>
  );
}

function AnimatedView({
  show,
  children,
  isTransitioning,
}: {
  show: boolean;
  children: React.ReactNode;
  isTransitioning: boolean;
}) {
  return (
    <div
      style={{
        position: show ? "relative" : "absolute",
        top: 0,
        left: 0,
        right: 0,
        opacity: show && !isTransitioning ? 1 : 0,
        transform:
          show && !isTransitioning
            ? "translateX(0)"
            : show
            ? "translateX(20px)"
            : "translateX(-20px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        pointerEvents: show ? "auto" : "none",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}
