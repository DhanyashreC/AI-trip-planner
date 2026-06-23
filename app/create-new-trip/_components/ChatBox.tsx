"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Send } from "lucide-react";
import React, { useState } from "react";
import EmptyBoxState from "./EmptyBoxState";

type Message = {
  role: string;
  content: string;
};

function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");

  const onSend = async () => {
  if (!userInput.trim()) return;

  const newMsg: Message = {
    role: "user",
    content: userInput,
  };

  setMessages((prev) => [...prev, newMsg]);
  setUserInput("");

  try {
    const result = await axios.post("/api/aimodel", {
      messages: [...messages, newMsg],
    });

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: result.data.resp || "No response",
      },
    ]);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="h-[85vh] flex flex-col">

        {messages?.length==0&&
        <EmptyBoxState onSelectOption={(v:string)=>{setUserInput(v); onSend()}} />
        }
      {/* Display Messages */}
      <section className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mt-2 ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-lg px-4 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-black"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </section>

      {/* User Input */}
      <section>
        <div className="border rounded-2xl p-4 relative">
          <Textarea
            placeholder="Create a trip for Paris from New York"
            className="h-20 border-0 focus-visible:ring-0 shadow-none resize-none"
            onChange={(event) =>
              setUserInput(event.target.value)
            }
            value={userInput}
          />

          <Button
            size="icon"
            className="absolute bottom-4 right-6"
            onClick={onSend}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

export default ChatBox;