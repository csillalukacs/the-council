import MemberQuotes from "./components/MemberQuotes";

export default function Quotes({
  showQuotes,
  setShowQuotes,
}: {
  showQuotes: boolean;
  setShowQuotes: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      {showQuotes && <MemberQuotes setShowQuotes={setShowQuotes} />}
    </>
  );
}
