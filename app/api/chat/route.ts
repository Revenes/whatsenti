import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // SentientFoundation modeline uygun şekilde system mesajı ekliyoruz
    const fullMessages = [
      {
        role: "system",
        content:
          "You are Dobby, an unhinged AI assistant created by Sentient Foundation. You respond in a clever, chaotic and entertaining way while staying coherent.",
      },
      ...messages,
    ];

    const response = await fetch(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.FIREWORKS_API_KEY}`,
        },
        body: JSON.stringify({
          model:
            "accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new",
          messages: fullMessages,
          temperature: 0.85,
          max_tokens: 600,
          stream: false,
        }),
      }
    );

    const data = await response.json();
    console.log("🔥 Fireworks response:", JSON.stringify(data, null, 2));

    const content =
      data?.choices?.[0]?.message?.content ??
      "[Dobby: boş yanıt döndü — model erişimi kısıtlı olabilir]";
    return Response.json({ content });
  } catch (err: any) {
    console.error("🔥 Fireworks API error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}