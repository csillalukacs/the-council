import AnimatedView from "./AnimatedView";
import HistoryListView from "./HistoryListView";
import ConversationView from "./ConversationView";
import { DIMENSIONS } from "../constants";
import type { Conversation } from "../types";

interface HistoryModalContentProps {
  history: Conversation[];
  openedConversation: number | null;
  isTransitioning: boolean;
  onConversationClick: (index: number) => void;
  onDeleteConversation: (reversedIndex: number) => void;
  onBack: () => void;
}

export default function HistoryModalContent({
  history,
  openedConversation,
  isTransitioning,
  onConversationClick,
  onDeleteConversation,
  onBack,
}: HistoryModalContentProps) {
  const currentConversation =
    openedConversation !== null
      ? history[history.length - 1 - openedConversation]
      : null;

  return (
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
          onConversationClick={onConversationClick}
          onDeleteConversation={onDeleteConversation}
        />
      </AnimatedView>

      <AnimatedView
        show={openedConversation !== null}
        isTransitioning={isTransitioning}
      >
        {currentConversation && (
          <ConversationView
            conversation={currentConversation}
            onBack={onBack}
          />
        )}
      </AnimatedView>
    </div>
  );
}
