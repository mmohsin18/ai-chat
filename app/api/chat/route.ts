import { NextResponse } from "next/server";
import { getAIResponse } from "@/lib/ai";
import axios from "axios";

type SearchResult = {
  title: string;
  snippet: string;
};

function formatSearchResults(jsonArray: SearchResult[]) {
  return jsonArray
    .map((item, idx) => {
      return `${idx + 1}. ${item.title} — ${item.snippet}`;
    })
    .join("\n");
}

export async function POST(req: Request) {
  const { message } = await req.json();

  const config = {
    method: "post",
    url: "https://google.serper.dev/search",
    headers: {
      "X-API-KEY": process.env.SERPER_API_KEY, // Store in .env.local
      "Content-Type": "application/json",
    },
    data: {
      q: message,
      gl: "bd",
    },
  };

  try {
    const response = await axios.request(config);
    // return NextResponse.json(response.data);

    const formattedResults = formatSearchResults(response.data.organic);

    const aiResponse = await getAIResponse(message, formattedResults);

    return NextResponse.json({ answer: aiResponse ?? "No answer generated." });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred." }, { status: 500 });
  }
}
