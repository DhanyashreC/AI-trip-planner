"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import EmptyBoxState from "./EmptyBoxState";
import GroupSIzeUi from "./GroupSIzeUi";
import BudgetUi from "./BudgetUi";
import TripDurationUi from "./TripDurationUi";
import FinalTripUi from "./FinalTripUi";








type Message = {
  role: string;
  content: string;
  ui?: string;
  tripData?: string;
};

function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [isFinal,setIsFinal]=useState (false);
  const[loading,setLoading] =useState(false)
  const[tripDetail,setTripDetail]=useState()

  const onSend = async () => {
  if (!userInput.trim()) return;

 setLoading (true);
  setUserInput('');
  const newMsg: Message = {
    role: "user",
    content: userInput,
  };

  setMessages((prev) => [...prev, newMsg]);
  setUserInput("");

  try {
    const result = await axios.post("/api/aimodel", {
      messages: [...messages, newMsg],
      isFinal:isFinal
    });
  



console.log("RESULT DATA:", result.data);
    !isFinal && setMessages((prev) => [
  ...prev,
  {
    role: "assistant",
    content: result.data.resp || "",
    ui: result.data.ui,
    tripData: result.data.resp,
  },
]);


   if (isFinal) {
  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      content: "",
      ui: "Final",
      tripData: JSON.stringify(result.data.trip_plan, null, 2),
    },
  ]);
}
  } catch (error) {
    console.error(error);
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
    const result = await axios.post("/api/aimodel", {
      messages: updatedMessages,
    });

    setMessages([
      ...updatedMessages,
      {
        role: "assistant",
        content: result.data.resp,
        ui: result.data.ui,
      },
    ]);
  } catch (error) {
    console.log(error);
  }
};

const RenderGenerativeUi = (
  ui: string | undefined,
  tripData?: string
) => {

  if (ui === "groupSize") {
    return (
      <GroupSIzeUi
        onSelectedOption={sendSelectedOption}
      />
    );
  }

  if (ui === "budget") {
    return (
      <BudgetUi
        onSelectedOption={sendSelectedOption}
      />
    );
  }

  if (ui === "tripDuration") {
    return (
      <TripDurationUi
        onSelectedOption={sendSelectedOption}
      />
    );
  }
 if (ui === "Final") {
  return (
    <FinalTripUi
      tripDetail={tripData}
      viewTrip={() => {
        console.log(tripData);
      }}
    />
  );
}

  return null;
};
useEffect(() => {
  const lastMsg = messages[messages.length - 1];

  if (lastMsg?.ui === "Final") {
    setIsFinal(true);
    setUserInput("OK, Great!");
    onSend();
  }
}, [messages]);
useEffect(()=> {
  if(isFinal && userInput){
    onSend();
  }
}, [isFinal]);


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
 {msg.ui === "Final" ? (
  <FinalTripUi
    tripDetail={msg.tripData || msg.content}
  />
) : (
  <>
    {msg.content}
    {RenderGenerativeUi(msg.ui)}
  </>
)}
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