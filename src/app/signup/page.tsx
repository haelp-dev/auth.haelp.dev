/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import { signup, checkIdentifier } from "./actions";
import { checkValidUsername } from "@lib/username";

interface SignupData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
}

type Item =
  | {
      type: "text";
      content: string;
    }
  | {
      type: "prompt";
      prompt: string;
      inputType: "text" | "password";
      key: keyof SignupData;
      value: string;
    }
  | {
      type: "error";
      content: string;
    };

export default function Home() {
  const [state, setState] = useState(0);
  const [items, setItems] = useState<Item[]>([
    { type: "text", content: "Loading..." },
  ]);
  const addItems = (...newItems: Item[]) => setItems([...items, ...newItems]);
  useEffect(() => {
    setState(1);
    setItems([
      {
        type: "prompt",
        prompt: "Enter your email",
        inputType: "text",
        key: "email",
        value: "",
      },
    ]);
  }, []);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: 0,
        top: containerRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  }, [items, inputRef, state]);

  const textShadow = 20;

  const [data, setData] = useState<SignupData>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  return (
    <main
      ref={containerRef}
      className="select-none h-screen bg-black text-white font-mono font-bold p-10 overflow-hidden relative before:absolute before:content-['>'] before:top-[39px] before:left-7 before:text-white caret-transparent"
      style={{
        textShadow: `0 0 ${textShadow}px #ffffff, 0 0 ${
          textShadow * 2
        }px #ffffff, 0 0 ${textShadow * 3}px #ffffff, 0 0 ${
          textShadow * 4
        }px #ffffff`,
      }}
      onClick={() => {
        if (inputRef.current) inputRef.current.focus();
      }}
      onKeyDown={async (e) => {
        try {
          if (e.key === "Enter") {
            if (state === -1) {
              history.go(0);
              return;
            }
            if (state === 1) {
              if (data.email === "") {
                addItems(
                  { type: "error", content: "Email cannot be empty" },
                  {
                    type: "prompt",
                    prompt: "Enter your email",
                    inputType: "text",
                    key: "email",
                    value: "",
                  }
                );
                return;
              } else if (await checkIdentifier(data.email)) {
                addItems(
                  { type: "error", content: "Email already in use" },
                  {
                    type: "prompt",
                    prompt: "Enter your email",
                    inputType: "text",
                    key: "email",
                    value: "",
                  }
                );
                return;
              } else {
                addItems({
                  type: "prompt",
                  prompt: "Enter your username",
                  inputType: "text",
                  key: "username",
                  value: "",
                });
                setState(2);
                return;
              }
            }
            if (state === 2) {
              if (!checkValidUsername(data.username)) {
                addItems(
                  {
                    type: "error",
                    content: "Username must be 3-16 alphanumeric characters",
                  },
                  {
                    type: "prompt",
                    prompt: "Enter your username",
                    inputType: "text",
                    key: "username",
                    value: "",
                  }
                );
                return;
              } else if (await checkIdentifier(data.username)) {
                addItems(
                  {
                    type: "error",
                    content: "Username taken",
                  },
                  {
                    type: "prompt",
                    prompt: "Enter your username",
                    inputType: "text",
                    key: "username",
                    value: "",
                  }
                );
                return;
              } else {
                addItems({
                  type: "prompt",
                  prompt: "Enter your password",
                  inputType: "password",
                  key: "password",
                  value: "",
                });
                setState(3);
                return;
              }
            }
            if (state === 3) {
              if (data.password === "") {
                addItems(
                  { type: "error", content: "Password cannot be empty" },
                  {
                    type: "prompt",
                    prompt: "Enter your password",
                    inputType: "password",
                    key: "password",
                    value: "",
                  }
                );
                return;
              } else {
                addItems({
                  type: "prompt",
                  prompt: "Confirm your password",
                  inputType: "password",
                  key: "confirmPassword",
                  value: "",
                });
                setState(4);
                return;
              }
            }
            if (state === 4) {
              if (data.password !== data.confirmPassword) {
                addItems(
                  { type: "error", content: "Passwords do not match" },
                  {
                    type: "prompt",
                    prompt: "Confirm your password",
                    inputType: "password",
                    key: "confirmPassword",
                    value: "",
                  }
                );
              } else {
                addItems({
                  type: "prompt",
                  prompt: "Enter your name (leave blank to use username)",
                  inputType: "text",
                  key: "name",
                  value: "",
                });
                setState(5);
              }
            }
            if (state === 5) {
              if (data.name === "") data.name = data.username;
              setData(data);
              addItems({
                type: "text",
                content: "Registering...",
              });
              setState(6);
              try {
                const res = await signup({ ...data, pfp: "" });
                if (res.success) {
                  addItems({
                    type: "text",
                    content: "Registered successfully!",
                  });
                } else {
                  addItems({
                    type: "error",
                    content: "Error: " + res.error,
                  });
                  setState(-1);
                }
              } catch (e) {
                addItems({
                  type: "error",
                  content: "Error: " + (e as Error).message,
                });
                setState(-1);
              }
            }
          }
        } catch (e) {
          addItems(
            { type: "error", content: "Error: " + (e as Error).message },
            {
              type: "prompt",
              inputType: "text",
              key: "email",
              prompt: "Hit enter to reload",
              value: "",
            }
          );
          setState(-1);
          console.error(e);
          return;
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

      {items.map((item, index) => (
        <span className={(index !== 0 && "mt-10") || ""} key={index}>
          {index !== 0 && <br />}
          {item.type === "text" ? (
            <>{item.content}</>
          ) : item.type === "error" ? (
            <span className="text-red-600">{item.content}</span>
          ) : (
            <>
              <span>{item.prompt}:</span>
              {index === items.length - 1 && (
                <input
                  className="text-white bg-transparent border-none outline-none w-0 overflow-hidden"
                  type={item.inputType}
                  ref={inputRef}
                  value={item.value}
                  onChange={(e) => {
                    // @ts-expect-error
                    items[index].value = e.target.value;
                    setItems(items);
                    setData({ ...data, [item.key]: e.target.value });
                  }}
                />
              )}
              <span className="ml-2">
                {item.inputType === "password"
                  ? Array.from({ length: item.value.length }, () => "•")
                  : item.value}
              </span>
            </>
          )}
        </span>
      ))}

      {/* cursor */}
      <span className="blink ml-1 pr-2 h-2 bg-white"></span>
    </main>
  );
}
