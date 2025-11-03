import { useState } from "react";
import QuotesButton from "./components/QuotesButton";
import MemberQuotes from "./components/MemberQuotes";

export default function Quotes() {
  const [showQuotes, setShowQuotes] = useState(false);

  return (
    <>
      <QuotesButton onClick={() => setShowQuotes(true)} />
      {showQuotes && <MemberQuotes setShowQuotes={setShowQuotes} />}
    </>
  );
}
