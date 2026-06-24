import React from "react";

export const SelectTravelersList = [
  {
    id: 1,
    title: "Just Me",
    icon: "✈️",
    people: "1",
  },
  {
    id: 2,
    title: "A Couple",
    icon: "🥂",
    people: "2 People",
  },
  {
    id: 3,
    title: "Family",
    icon: "🏡",
    people: "3-5 People",
  },
  {
    id: 4,
    title: "Friends",
    icon: "⛵",
    people: "5-10 People",
  },
];

function GroupSizeUi({onSelectedOption}:any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-center mt-3">
      {SelectTravelersList.map((item) => (
        <div
          key={item.id}
          className="p-3 border rounded-2xl bg-white hover:border-primary cursor-pointer hover:shadow-md transition-all"
        
            onClick={()=>onSelectedOption(item.title+":"+item.people)}
            >
          <h2 className="text-3xl">{item.icon}</h2>

          <h2 className="font-bold mt-2">
            {item.title}
          </h2>

          <p className="text-sm text-gray-500">
            {item.people}
          </p>
        </div>
      ))}
    </div>
  );
}

export default GroupSizeUi;