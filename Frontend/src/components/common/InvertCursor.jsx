import { useEffect, useRef } from "react";

const InvertCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    const moveCursor = (e) => {
      const { clientX, clientY } = e;

      cursor.style.left = `${clientX}px`;
      cursor.style.top = `${clientY}px`;

      // 🔥 KEY FIX: detect element under cursor
      const elementUnderCursor = document.elementFromPoint(clientX, clientY);

      if (elementUnderCursor?.closest(".Invert-cursor-text")) {
        cursor.classList.add("active");
      } else {
        cursor.classList.remove("active");
      }
    };

    document.addEventListener("mousemove", moveCursor);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return <div ref={cursorRef} className="invert-cursor" />;
};

export default InvertCursor;
