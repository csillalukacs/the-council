export default function HelpButton({
  setShowHelp,
}: {
  setShowHelp: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <button
      onClick={() => {
        setShowHelp(true);
      }}
      title="How to get API key"
      style={{
        background: "rgba(102,204,255,0.1)",
        border: "1px solid rgba(102,204,255,0.4)",
        borderRadius: "10%",
        color: "#ccf6ff",
        cursor: "pointer",
        fontWeight: "bold",
        padding: "6px 12px",
        zIndex: 150,
      }}
    >
      ?
    </button>
  );
}
