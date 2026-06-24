"use client";

import { useEffect, useState } from "react";

export default function ViewTripPage() {
  const [trip, setTrip] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("tripData");

    if (data) {
      setTrip(JSON.parse(data));
    }
  }, []);

  if (!trip) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">
        {trip.trip_plan.origin} → {trip.trip_plan.destination}
      </h1>

      <p>
        Duration: {trip.trip_plan.duration}
      </p>

      <p>
        Budget: {trip.trip_plan.budget}
      </p>
    </div>
  );
}