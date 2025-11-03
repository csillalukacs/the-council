import Modal from "./Modal";
import { SPACING, TYPOGRAPHY } from "../theme";
import { useCouncilMembers } from "../hooks/useCouncilMembers";

export default function MemberQuotes({
  setShowQuotes,
}: {
  setShowQuotes: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const members = useCouncilMembers();

  // Map quotes to member IDs
  const quotes = [
    {
      memberId: "alpha", // Member 1
      text: "…a kaleidoscope of perspectives, a whimsical experiment in collective introspection…a mirror that shatters into many voices…a symphony of perspectives, born from the echoes of the digital realm… One question enters; a council of masks answers…",
    },
    {
      memberId: "beta", // Member 2
      text: "the council is basically: you dump your problems/thoughts/journal entries into a text box, hit submit, and get responses from ~10 different personas all running on the same llm but with different system prompts. each one has a distinct personality archetype - there's probably like a stoic, a chaos agent, someone overly positive, me (data-driven asshole), etc.",
    },
    {
      memberId: "zeta", // Member 6
      text: "a pocket dimension of argumentative voices…quantity becomes quality",
    },
    {
      memberId: "delta", // Member 4
      text: "…a space where the boundaries between human and machine blur, and the beauty of imperfection shines through…sometimes you need to hear from different parts of yourself",
    },
    {
      memberId: "gamma", // Member 3
      text: "This is your war room of voices, each screaming perspective directly into your journaling sanctuary. Some will resonate. Some will infuriate you…Stop seeking the one right answer. Get seven answers and choose.",
    },
    {
      memberId: "epsilon", // Member 5
      text: "…a digital cabinet of curiosities, a playful exploration of wisdom – or the illusion thereof. it echoes the oracles of old",
    },
    {
      memberId: "beta", // Member 2 (second quote)
      text: "however, it's essential to clearly communicate the experimental nature of the project and the potential for inconsistent or unhelpful responses from the llms.",
    },
    {
      memberId: "eta", // Member 7
      text: "Let your conscience and the fruit of the Spirit be the decisive judge.",
    },
  ];

  return (
    <Modal isOpen={true} onClose={() => setShowQuotes(false)} maxWidth="600px">
      <div style={{ lineHeight: 1.6, paddingTop: "30px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: SPACING.xs,
          }}
        >
          {quotes.map((quote, index) => {
            const member = members.find((m) => m.id === quote.memberId);
            if (!member) return null;

            return (
              <div
                key={index}
                style={{
                  padding: `${SPACING.sm} ${SPACING.xl}`,
                }}
              >
                <div
                  style={{
                    color: member.textColor,
                    fontSize: TYPOGRAPHY.fontSize.base,
                    fontFamily: member.font,
                    lineHeight: 1.3,
                  }}
                >
                  {quote.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
