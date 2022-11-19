import ContentEditable from "react-contenteditable";
import { useEffect, useRef, useState } from "react";

const strippedString = (originalString: string) =>
  originalString.replace(/(<([^>]+)>)/gi, "");

export default function Editable({
  defaultText = "New Request",
  onUpdate,
  isFocused,
}: {
  defaultText?: string;
  onUpdate: (s: string) => void;
  isFocused: boolean;
}) {
  const text = useRef(defaultText);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isFocused) {
      setDisabled(false);
      setTimeout(() => {
        ref?.current && ref.current.focus();
      }, 0);
    }
  }, [isFocused]);

  const [isDisabled, setDisabled] = useState(true);
  return (
    <>
      <ContentEditable
        innerRef={ref}
        style={{
          display: "inline-block",
          minWidth: 200,
          cursor: "pointer",
          outline: "0px solid transparent",
          textDecoration: isDisabled ? "none" : "underline",
          fontStyle: isDisabled ? "normal" : "italic",
        }}
        disabled={isDisabled}
        onFocus={(e) =>
          window.getSelection()?.selectAllChildren(e.currentTarget)
        }
        onDoubleClick={() => {
          setDisabled(false);
          setTimeout(() => {
            ref?.current && ref.current.focus();
          }, 0);
        }}
        onBlur={() => {
          setDisabled(true);
          onUpdate(text.current);
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            setDisabled(true);
            onUpdate(text.current);
          }
        }}
        html={text.current}
        onChange={(e) => {
          text.current = strippedString(e.target.value) || defaultText;
        }}
      />
    </>
  );
}
