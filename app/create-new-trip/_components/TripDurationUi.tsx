"use client";

import { useState } from "react";

function TripDurationUi({ onSelectedOption }: any) {
  const [days, setDays] = useState(3);

  return (
    <div className="bg-white border rounded-xl p-4 mt-2">
      <h2 className="font-bold text-center mb-4">
        How many days do you want to travel?
      </h2>

      <div className="flex items-center justify-center gap-6">
        <button
          className="w-10 h-10 rounded-full bg-gray-200"
          onClick={() => days > 1 && setDays(days - 1)}
        >
          -
        </button>

        <h2 className="text-2xl font-bold">
          {days} Days
        </h2>

        <button
          className="w-10 h-10 rounded-full bg-gray-200"
          onClick={() => setDays(days + 1)}
        >
          +
        </button>
      </div>

      <div className="flex justify-center mt-4">
        <button
          className="bg-primary text-white px-5 py-2 rounded-lg"
          onClick={() => onSelectedOption(days.toString())}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default TripDurationUi;