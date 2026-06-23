import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const PROMPT = `
You are an AI Trip Planner.

Collect only these details:

1. Starting Location
2. Destination
3. Number of People
4. Budget (Low, Medium, Luxury)

Ask one question at a time.

After collecting all details, generate:

- Trip Summary
- Places to Visit
- Food Recommendations
- Estimated Budget
- Travel Tips

Always return JSON:

{
  "resp":"message",
  "ui":"source/destination/people/budget/final"
}
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

    const content = apiResponse.choices[0].message.content;

    console.log("AI Response:", content);

    if (!content) {
      return NextResponse.json({
        resp: "Great! To start planning your trip, could you please tell me your starting location?",
        ui: "source",
      });
    }

    try {
      const parsedData = JSON.parse(content);

      return NextResponse.json(parsedData);
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