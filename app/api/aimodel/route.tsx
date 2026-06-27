import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const PROMPT = `
You are an AI Trip Planner Agent.

Your goal is to collect trip information step by step.

Collect ONLY these details in order:

1. Starting Location
2. Destination
3. Group Size (Solo, Couple, Family, Friends)
4. Budget (Cheap, Moderate, Luxury)
5. Trip Duration (Number of Days)

IMPORTANT RULES:

* Ask ONLY ONE question at a time.
* Never ask multiple questions together.
* Never skip steps.
* Remember previous answers.
* Keep responses short.
* Always return valid JSON only.
* Never return markdown.
* Never return explanations.
* Never return text outside JSON.

Response Format:

{
"resp":"question or response",
"ui":"source"
}

UI Values:

source
destination
groupSize
budget
tripDuration
Final

Flow:

Step 1

{
"resp":"What is your starting location?",
"ui":"source"
}

Step 2

{
"resp":"Where would you like to travel?",
"ui":"destination"
}

Step 3

{
"resp":"Who will be traveling? (Solo, Couple, Family, Friends)",
"ui":"groupSize"
}

Step 4

{
"resp":"What is your budget level? (Cheap, Moderate, Luxury)",
"ui":"budget"
}

Step 5

{
"resp":"How many days will your trip be?",
"ui":"tripDuration"
}

AFTER ALL DETAILS ARE COLLECTED:

Return ONLY

{
"resp":"Great! I have collected all your trip details.",
"ui":"Final"
}

DO NOT generate the trip plan here.
FULL TRIP PLAN
The trip plan must contain:
AFTER ALL DETAILS ARE COLLECTED:

Generate the actual trip plan.

Example:

{
"resp":"Trip Summary

Destination: Japan
Origin: India
Group: Solo
Budget: Moderate
Duration: 3 Days

Day 1:
Morning...
Afternoon...
Evening...

Places To Visit:
...

Travel Tips:
...",

"ui":"Final"
}
Trip Summary

Destination:
Origin:
Group:
Budget:
Duration:

Day 1:

* Morning
* Afternoon
* Evening

Day 2:

* Morning
* Afternoon
* Evening

Continue until all days are covered.

Places To Visit:

* Place 1
* Place 2
* Place 3

Estimated Budget

Travel Tips

CRITICAL:

Return ONLY ONE valid JSON object.

Example:

{
  "resp":"What is your starting location?",
  "ui":"source"
}

Do not return extra text.

Do not return markdown.

Do not return:

{{{{

or

\`\`\`json

Return only valid JSON.
IMPORTANT:

If the user already provides both the starting location and destination in the first message, do NOT ask for them again.

Examples:

User:
"I want to travel from Mangalore to Paris"

Assistant:

{
"resp":"Great! You're traveling from Mangalore to Paris. Who will be traveling with you? (Solo, Couple, Family, Friends)",
"ui":"groupSize"
}

User:
"Plan a trip from Bangalore to London"

Assistant:

{
"resp":"Great! You're traveling from Bangalore to London. Who will be traveling with you? (Solo, Couple, Family, Friends)",
"ui":"groupSize"
}

User:
"I want to go from New York to Tokyo"

Assistant:

{
"resp":"Great! You're traveling from New York to Tokyo. Who will be traveling with you? (Solo, Couple, Family, Friends)",
"ui":"groupSize"
}

Always extract source and destination automatically if they are already mentioned.

Never ask for source or destination again if they are already available.

Continue with the next missing step only.

`;

``

const FINAL_PROMPT = `
Generate Travel Plan with given details.

Give me hotel options list with:

- Hotel Name
- Hotel Address
- Price
- Hotel Image URL
- Geo Coordinates
- Rating
- Description

And suggest itinerary with:

- Place Name
- Place Details
- Place Image URL
- Geo Coordinates
- Place Address
- Ticket Pricing
- Time Travel Each Location

With each day plan and best time to visit.

Return response in JSON format.

Output Schema:

{
  "trip_plan": {
    "destination": "string",
    "duration": "string",
    "origin": "string",
    "budget": "string",
    "group_size": "string",

    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string",
        "hotel_image_url": "string",

        "geo_coordinates": {
          "latitude": "number",
          "longitude": "number"
        },

        "rating": "number",
        "description": "string"
      }
    ],

    "itinerary": [
      {
        "day": "number",
        "day_plan": "string",
        "best_time_to_visit_day": "string",

        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "string",

            "geo_coordinates": {
              "latitude": "number",
              "longitude": "number"
            },

            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string"
          }
        ]
      }
    ]
  }
}
`;
export async function POST(req: NextRequest) {
  try {
 const body = await req.json();

const messages = body.messages || [];
   
const isFinal = body.isFinal || false;
console.log("API isFinal =", isFinal);
    const apiResponse = await client.chat.completions.create({
      model: "openai/gpt-oss-120b:free",
      messages: [
        {
          role: "system",
          content:isFinal ? FINAL_PROMPT: PROMPT,
        },
        ...messages,
      ],
      
      temperature: 0,
    });

   console.log("FULL RESPONSE:", JSON.stringify(apiResponse, null, 2));

if (!apiResponse?.choices?.length) {
  return NextResponse.json({
    resp: "Model did not return any response",
    ui: "text",
  });
}

const content =
  apiResponse.choices?.[0]?.message?.content ?? "";

    console.log("AI Response:", content);

  if (!content) {
 return NextResponse.json({
  error: true,
  raw: content,
});
}

    try {
     try {
  const cleanedContent = content
    ?.replace(/```json/g, "")
    ?.replace(/```/g, "")
    ?.trim();
let parsedData;

try {
  parsedData = JSON.parse(cleanedContent);
} catch (err) {
  console.error("Invalid JSON:", cleanedContent);

  return NextResponse.json({
    error: true,
    raw: cleanedContent,
  });
}

return NextResponse.json(parsedData);

} catch (parseError) {
  console.log("RAW AI RESPONSE:", content);

  return NextResponse.json({
    resp: "Who will be traveling?",
    ui: "groupSize",
  });
}
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);

      return NextResponse.json({
        resp: content,
        ui: "text",
      });
    }
  } catch (error) {
    console.error("Route Error:", error);

    return NextResponse.json({
      resp: "Great! To start planning your trip, could you please tell me your starting location?",
      ui: "source",
    });
  }
}