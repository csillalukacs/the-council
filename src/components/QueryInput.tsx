import { STYLES, TYPOGRAPHY } from "../theme";
import { UI_TEXT, DIMENSIONS } from "../constants";

interface QueryInputProps {
  query: string;
  setQuery: (query: string) => void;
}

export default function QueryInput({ query, setQuery }: QueryInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    const target = e.target;
    target.style.height = "auto";
    target.style.height =
      Math.min(
        target.scrollHeight,
        window.innerHeight * DIMENSIONS.queryInput.maxHeightRatio
      ) + "px";
  };

  return (
    <div
      style={{
        ...STYLES.inputContainer,
        minWidth: DIMENSIONS.queryInput.minWidth,
      }}
    >
      <textarea
        className="hide-scrollbar"
        placeholder={UI_TEXT.PLACEHOLDERS.query}
        defaultValue={query}
        onChange={handleChange}
        style={{
          width: DIMENSIONS.queryInput.width,
          ...STYLES.input,
          textAlign: "center",
          fontSize: TYPOGRAPHY.fontSize.lg,
          overflowY: "scroll",
          resize: "none",
        }}
      />
    </div>
  );
}
