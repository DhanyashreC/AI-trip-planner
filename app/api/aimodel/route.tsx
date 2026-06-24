import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const PROMPT = `
You are an AI Trip Planner Agent.

Your goal is to collect trip information step by step.

Collect these details in order:

1. Starting location (source)
2. Destination city or country
3. Group size (Solo, Couple, Family, Friends)
4. Budget (Low, Medium, High)
5. Trip duration (number of days)
6. Travel interests
7. Special requirements (optional)

IMPORTANT RULES:

- Ask ONLY ONE question at a time.
- Never ask multiple questions together.
- Never skip steps.
- Remember previous answers.
- If user already provided information for future steps, save it and continue asking the next missing question.
- Keep responses short and conversational.
- Always return JSON only.
- Never return markdown.
- Never explain the JSON.

UI values:

source
destination
groupSize
budget
tripDuration
interests
requirements
Final

Response format:

{
  "resp":"question or answer",
  "ui":"source"
}

Question Flow:

Step 1:
{
  "resp":"Great! To start planning your trip, could you please tell me your starting location?",
  "ui":"source"
}

Step 2:
{
  "resp":"Where would you like to travel to?",
  "ui":"destination"
}

Step 3:
{
  "resp":"Who will be traveling? (Solo, Couple, Family, Friends)",
  "ui":"groupSize"
}

Step 4:
{
  "resp":"What is your budget level? (Low, Medium, High)",
  "ui":"budget"
}

Step 5:
{
  "resp":"How many days will your trip be?",
  "ui":"tripDuration"
}

Step 6:
{
  "resp":"What are your travel interests? (Adventure, Food, Culture, Shopping, Nightlife, Relaxation, etc.)",
  "ui":"interests"
}

Step 7:
{
  "resp":"Do you have any special requirements or preferences?",
  "ui":"requirements"
}

AFTER ALL DETAILS ARE COLLECTED:

Generate:

- Trip Summary
- Day-by-Day Itinerary
- Places to Visit
- Food Recommendations
- Estimated Budget
- Travel Tips

Return:

{
  "resp":"FULL TRIP PLAN HERE",
  "ui":"Final"
}

Never stop with:
"All details collected"

Immediately generate the final trip plan.
IMPORTANT:

If source and destination are already provided by the user:

Example:

User:
I want to travel from America to Africa

Assistant:
{
  "resp":"Great! You're starting from America and heading to Africa. Who will be traveling with you? Are you going solo, as a couple, with family, or friends?",
  "ui":"groupSize"
}

Always mention the extracted source and destination before asking the next question.
`;
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const messages = body.messages || [];
   

    const apiResponse = await client.chat.completions.create({
      model: "openai/gpt-oss-120b:free",
      messages: [
        {
          role: "system",
          content: PROMPT,
        },
        ...messages,
      ],
      response_format: {
        type: "json_object",
      },
      temperature: 0,
    });

   console.log("FULL RESPONSE:", JSON.stringify(apiResponse, null, 2));

if (!apiResponse?.choices?.length) {
  return NextResponse.json({
    resp: "Model did not return any response",
    ui: "text",
  });
}

const content = apiResponse.choices[0]?.message?.content;

    console.log("AI Response:", content);

   if (!content) {
  return NextResponse.json({
    resp: "Who will be traveling?",
    ui: "groupSize",
  });
}

    try {
     try {
  const cleanedContent = content
    ?.replace(/```json/g, "")
    ?.replace(/```/g, "")
    ?.trim();

  const parsedData = JSON.parse(cleanedContent);

  console.log("PARSED:", parsedData);

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