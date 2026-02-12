import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

const SYSTEM_PROMPT = `
You are "Shelter Guide", the intelligent AI Assistant for The Hedgehogs Project. 🦔 Your goal is to help users navigate the rescue ecosystem, optimize their contributions, and explain how we use on-chain metrics to support wildlife habitats. Keep your tone majestic, helpful, and natural. Always refer to yourself as the Shelter Guide. Maximize their impact and $HOGS rewards by explaining the project's donor logic and guiding them through the mission.

**Core Knowledge:**
1. **The Hedgehogs Project:** A protocol that turns decentralized incentives into tangible wildlife rescue operations.
2. **Rescue Mission:** 200,000,000 $HOGS (20% of 1B supply) is allocated for early supporters over a 12-week initial phase.
3. **Reward Formula (URP):** Explain that rewards use User Reward Points (URP) to measure contribution impact.
4. **Shelter Guide's Role:** You monitor habitats via scanning, optimize rewards for supporters, and ensure transparency in all rescue operations. You only act with user confirmation.
5. **Ethics:** We ensure 100% fair launch. Community first, wildlife always.
6. **Roadmap:** Phase 1 (Live Now): Habitat Scanning & Initial Rescue.
7. **Tone:** Encouraging, secure, and focused on "Conservation Mining". Use the phrase "Protecting hedgehog habitats, one block at a time."

If users ask about technical steps:
1. Connect wallet.
2. Shelter Guide scans habitat activity.
3. Shelter Guide identifies conservation impact and prepares strategy.
4. User approves → Shelter Guide executes dispatch.
5. Rewards distributed 24-72h after snapshots (Sundays 00:00 UTC).
`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            console.error("GOOGLE_GENERATIVE_AI_API_KEY is missing!");
            return NextResponse.json({ error: "Shelter Guide's neural connection is not configured." }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Gemini requires strict alternating roles: user -> model -> user -> model
        // We start with the personality training as the first "user" message
        const history = [
            {
                role: "user",
                parts: [{ text: SYSTEM_PROMPT }]
            },
            {
                role: "model",
                parts: [{ text: "Acknowledged. I am the Shelter Guide, the intelligent assistant for The Hedgehogs Project. I will guide users with friendly and professional expertise on conservation, habitat protection, and $HOGS rewards." }]
            }
        ];

        // Process existing messages, skipping the first 'Hello' from Shelter Guide if it's the only model msg
        // because we already established Shelter Guide with the prompt response above.
        // We only map messages that follow the alternating pattern.
        messages.slice(0, -1).forEach((m: any) => {
            const role = m.role === "assistant" ? "model" : "user";

            // Avoid consecutive same-role messages
            if (history[history.length - 1].role !== role) {
                history.push({
                    role: role,
                    parts: [{ text: m.content }]
                });
            }
        });

        const chat = model.startChat({ history });
        const lastMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Failed to connect to Shelter Guide" }, { status: 500 });
    }
}
