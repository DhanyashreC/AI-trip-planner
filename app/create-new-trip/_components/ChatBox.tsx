"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Send } from "lucide-react";
import React, { useState } from "react";
import EmptyBoxState from "./EmptyBoxState";
import GroupSIzeUi from "./GroupSIzeUi";
import BudgetUi from "./BudgetUi";
import TripDurationUi from "./TripDurationUi";
import FinalTripUi from "./FinalTripUi";

type Message = {
  role: string;
  content: string;
  ui?: string;
  tripData?: any; // Changed to any to accept strings or objects safely
};

function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [isFinal, setIsFinal] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSend = async () => {
    if (!userInput.trim()) return;

    setLoading(true);
    const currentInput = userInput;
    setUserInput('');

    const newMsg: Message = {
      role: "user",
      content: isFinal ? "Generate Trip Plan" : currentInput,
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);

    try {
      // Determine if we are at the final step based on the last UI shown
      const currentIsFinal = isFinal || messages.some(m => m.ui === "tripDuration");

      const result = await axios.post("/api/aimodel", {
        messages: updatedMessages,
        isFinal: currentIsFinal
      });

      console.log("RESULT DATA:", result.data);

      if (result.data.ui === "Final" || result.data.trip_plan || currentIsFinal) {
        setIsFinal(true);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "",
            ui: "Final",
            tripData: result.data.trip_plan ? result.data.trip_plan : result.data,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: result.data.resp || "",
            ui: result.data.ui,
            tripData: result.data.resp,
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

const sendSelectedOption = async (value: string) => {
    const newMsg: Message = {
      role: "user",
      content: value,
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    
    try {
      // FIX: Only go to final prompt if the user just selected the trip duration!
      const currentIsFinal = isFinal || messages.some(m => m.ui === "tripDuration");

      const result = await axios.post("/api/aimodel", {
        messages: updatedMessages,
        isFinal: currentIsFinal
      });

      if (result.data.ui === "Final" || result.data.trip_plan) {
        setIsFinal(true);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "",
            ui: "Final",
            tripData: result.data.trip_plan ? result.data.trip_plan : result.data,
          },
        ]);
      } else {
        setMessages([
          ...updatedMessages,
          {
            role: "assistant",
            content: result.data.resp || "",
            ui: result.data.ui,
            tripData: result.data.resp,
          },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const RenderGenerativeUi = (ui: string | undefined) => {
    if (!ui) return null;
    if (ui === "groupSize") return <GroupSIzeUi onSelectedOption={sendSelectedOption} />;
    if (ui === "budget") return <BudgetUi onSelectedOption={sendSelectedOption} />;
    if (ui === "tripDuration") return <TripDurationUi onSelectedOption={sendSelectedOption} />;
    return null;
  };

  return (
    <div className="h-[85vh] flex flex-col">
      {/* Empty State */}
      {messages.length === 0 && (
        <EmptyBoxState
          onSelectOption={async (v: string) => {
            const newMsg = { role: "user", content: v };
            setMessages([newMsg]);
            try {
              const result = await axios.post("/api/aimodel", {
                messages: [newMsg],
                isFinal: false,
              });
              setMessages([
                newMsg,
                {
                  role: "assistant",
                  content: result.data.resp || "",
                  ui: result.data.ui,
                },
              ]);
            } catch (err) {
              console.error(err);
            }
          }}
        />
      )}

      {/* Display Messages */}
      <section className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mt-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-lg px-4 py-2 rounded-lg ${
                msg.role === "user" ? "bg-primary text-white" : "bg-gray-100 text-black"
              }`}
            >
              {msg.ui === "Final" ? (
                <FinalTripUi tripDetail={msg.tripData} />
              ) : (
                <>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {RenderGenerativeUi(msg.ui)}
                </>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="text-sm text-gray-400 animate-pulse mt-2">AI is typing...</div>}
      </section>

      {/* User Input */}
      <section className="p-4">
        <div className="border rounded-2xl p-4 relative bg-white">
          <Textarea
            placeholder="Create a trip for Paris from New York"
            className="h-20 border-0 focus-visible:ring-0 shadow-none resize-none"
            onChange={(event) => setUserInput(event.target.value)}
            value={userInput}
            disabled={loading}
          />
          <Button
            size="icon"
            className="absolute bottom-4 right-6"
            onClick={onSend}
            disabled={loading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

export default ChatBox;