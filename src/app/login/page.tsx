/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import { login } from "./actions";

export default function Home() {
  const [state, setState] = useState(0);
  const [error, setError] = useState("");
  useEffect(() => {
    const timers = [
      setTimeout(() => {
        setState(1);
      }, 300),
    ];
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    if (state === 1) {
      refs[0].current?.focus();
    } else if (state === 2) {
      refs[1].current?.focus();
    }
  }, [state]);

  const textShadow = 20;

  const [loginInfo, setLoginInfo] = useState(["", ""]);
  return (
    <main
      className="select-none h-screen bg-black text-white font-mono font-bold p-10 relative before:absolute before:content-['>'] before:top-[39px] before:left-7 before:text-white caret-transparent"
      style={{
        textShadow: `0 0 ${textShadow}px #ffffff, 0 0 ${textShadow * 2}px #ffffff, 0 0 ${
          textShadow * 3
        }px #ffffff, 0 0 ${textShadow * 4}px #ffffff`,
      }}
      onClick={() => {
        if (state === 1) {
          refs[0].current?.focus();
        } else if (state === 2) {
          refs[1].current?.focus();
        }
      }}
      onKeyDown={async (e) => {
        if (e.key === "Enter") {
          if (state === 1) {
            if (loginInfo[0] !== "") setState(2);
          } else if (state === 2) {
            if (loginInfo[1] !== "") {
              setState(3);
              const res = await login(loginInfo[0], loginInfo[1]);
              if (res.success) {
                alert("Logged in!");
              } else {
                setState(4);
                setError(res.error);
              }
            }
          } else if (state === 4) {
            setState(1);
            setError("");
            setLoginInfo([loginInfo[0], ""]);
          }
        }
      }}
    >
      <style jsx>
        {`
          @keyframes blink {
            0%,
            100%,
            49.99% {
              opacity: 0;
            }
            50%,
            99.99% {
              opacity: 1;
            }
          }
          .blink {
            animation: blink 1s infinite;
          }
        `}
      </style>

      {/* loading */}
      {state === 0 && <span>Loading...</span>}

      {/* username */}
      {state >= 1 && (
        <>
          <span className="mt-10">
            <span>Username/email:</span>
            <input
              className="text-white bg-transparent border-none outline-none w-0 overflow-hidden"
              type="text"
              ref={refs[0]}
              onChange={(e) => setLoginInfo([e.target.value, loginInfo[1]])}
            />
            <span className="ml-2">{loginInfo[0]}</span>
          </span>
        </>
      )}

      {/* password */}
      {state >= 2 && (
        <>
          <br />
          <span className="mt-10">
            <span>Password:</span>
            <input
              className="text-white bg-transparent border-none outline-none w-0 overflow-hidden"
              type="password"
              ref={refs[1]}
              onChange={(e) => setLoginInfo([loginInfo[0], e.target.value])}
            />
            <span className="ml-2">
              {Array.from({ length: loginInfo[1].length }, () => "•")}
            </span>
          </span>
        </>
      )}

      {/* authing */}
      {state >= 3 && (
        <>
          <br />
          <span className="mt-5">
            <span>Authenticating...</span>
          </span>
        </>
      )}

      {/* error */}
      {state >= 4 && (
        <>
          <br />
          <span className="mt-5">
            <span className="text-red-500">
              {error}
              <br />
              Hit enter to try again.
            </span>
          </span>
        </>
      )}

      {/* cursor */}
      <span className="blink ml-1 pr-2 h-2 bg-white"></span>
    </main>
  );
}
