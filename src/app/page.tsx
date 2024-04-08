"use client";

import { redirect } from "next/navigation";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const textShadow = 20;

  const inputRef = useRef<HTMLInputElement>(null);

  const focus = () => inputRef.current && inputRef.current.focus();
	const router = useRouter();

  useEffect(() => {
    focus();
  }, []);

  return (
    <main
      className="select-none h-screen bg-black text-white font-mono font-bold p-10 relative before:absolute before:content-['>'] before:top-[39px] before:left-7 before:text-white caret-transparent"
      style={{
        textShadow: `0 0 ${textShadow}px #ffffff, 0 0 ${textShadow * 2}px #ffffff, 0 0 ${
          textShadow * 3
        }px #ffffff, 0 0 ${textShadow * 4}px #ffffff`,
      }}
      onClick={focus}
      onKeyDown={async (e) => {
        if (e.key === "Enter") {
          router.push("/login");
        }
      }}
    >
      <input type="text" className="w-0" ref={inputRef} />
      <span>Press enter to log in...</span>

      {/* cursor */}
      <span className="blink ml-1 pr-2 h-2 bg-white"></span>
    </main>
  );
}
