import { useState } from "react";
import Modal from "./components/Modal";
import HistoryListView from "./components/HistoryListView";
import ConversationView from "./components/ConversationView";
import { UI_TEXT, DIMENSIONS, TIMING } from "./constants";
import { STYLES, SPACING } from "./theme";
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

  const currentConversation =
    openedConversation !== null
      ? history[history.length - 1 - openedConversation]
      : null;

  return (
    <div>
      <div
        style={{
          position: "absolute",
          bottom: DIMENSIONS.history.buttonPosition.bottom,
          right: DIMENSIONS.history.buttonPosition.right,
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
          {UI_TEXT.BUTTONS.viewHistory}
        </button>
      </div>

      <Modal
        isOpen={showHistory}
        onClose={handleCloseModal}
        title={openedConversation === null ? "Conversation History" : undefined}
        maxWidth={DIMENSIONS.modal.maxWidth.history}
      >
        <div
          style={{
            position: "relative",
            minHeight: DIMENSIONS.modal.minHeight,
            overflow: "hidden",
          }}
        >
          <AnimatedView
            show={openedConversation === null}
            isTransitioning={isTransitioning}
          >
            <HistoryListView
              history={history}
              onConversationClick={(index) => transitionTo(index)}
              onDeleteConversation={deleteConversation}
            />
          </AnimatedView>

          <AnimatedView
            show={openedConversation !== null}
            isTransitioning={isTransitioning}
          >
            {currentConversation && (
              <ConversationView
                conversation={currentConversation}
                onBack={() => transitionTo(null)}
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
  const visible = show && !isTransitioning;
  const translateX = DIMENSIONS.transform.translateX;
  return (
    <div
      style={{
        position: show ? "relative" : "absolute",
        top: 0,
        left: 0,
        right: 0,
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(0)"
          : show
          ? `translateX(${translateX})`
          : `translateX(-${translateX})`,
        transition: "opacity 0.3s ease, transform 0.3s ease",
        pointerEvents: show ? "auto" : "none",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}
