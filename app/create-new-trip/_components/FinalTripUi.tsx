"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe2 } from "lucide-react";

function FinalTripUi({ tripDetail }: any) {
  const [showPlan, setShowPlan] = useState(false);

  if (!tripDetail) {
    return null;
  }

const trip = tripDetail;

  return (
    <div className="bg-white rounded-xl border p-4 mt-3">
      {!showPlan ? (
        <div className="flex flex-col items-center">
          <Globe2 className="animate-bounce text-primary" />

          <h2 className="mt-2 font-semibold text-lg text-primary">
            ✈️ Planning your dream trip...
          </h2>

          <p className="text-sm text-gray-500 text-center mt-2">
            Gathering best destinations, activities and travel details.
          </p>

          <Button
            className="mt-4"
            onClick={() => setShowPlan(true)}
          >
            View Trip
          </Button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            🌍 {trip?.destination}
          </h2>

          {/* Trip Summary */}
          <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-xl">
            <div>📍 Origin: {trip?.origin}</div>
            <div>💰 Budget: {trip?.budget}</div>
            <div>👥 Group: {trip?.group_size}</div>
            <div>📅 Duration: {trip?.duration}</div>
          </div>

          {/* Hotels */}
          <h2 className="text-xl font-bold mb-3">
            🏨 Recommended Hotels
          </h2>

          {trip?.hotels?.map((hotel: any, index: number) => (
            <div
              key={index}
              className="border rounded-xl p-4 mb-4"
            >
              <h3 className="font-bold text-lg">
                {hotel.hotel_name}
              </h3>

              <p>📍 {hotel.hotel_address}</p>
              <p>⭐ {hotel.rating}</p>
              <p>💰 {hotel.price_per_night}</p>

              <p className="mt-2 text-gray-600">
                {hotel.description}
              </p>
            </div>
          ))}

          {/* Itinerary */}
          <h2 className="text-xl font-bold mt-6 mb-3">
            🗓️ Itinerary
          </h2>

          {trip?.itinerary?.map((day: any, index: number) => (
            <div
              key={index}
              className="border rounded-xl p-4 mb-4"
            >
              <h3 className="font-bold text-lg mb-2">
                Day {day.day}
              </h3>

              <p className="mb-3">
                {day.day_plan}
              </p>

              {day.activities?.map(
                (place: any, i: number) => (
                  <div
                    key={i}
                    className="bg-gray-50 p-3 rounded-lg mb-2"
                  >
                    <h4 className="font-semibold">
                      📍 {place.place_name}
                    </h4>

                    <p>{place.place_details}</p>

                    <p>
                      🎫 {place.ticket_pricing}
                    </p>

                    <p>
                      ⏰ {place.best_time_to_visit}
                    </p>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FinalTripUi;