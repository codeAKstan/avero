import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { documentUrl, rawText, fileType } = body;

    if (!documentUrl && !rawText) {
      return NextResponse.json(
        { error: "Please provide a document URL or text to process." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_APIKEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_APIKEY is not configured on the server." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are a high-speed exam question parser for AVERO ACADEMY. Extract all past exam questions, options, correct answers, and concise clinical rationales into JSON format.

JSON format:
{
  "title": "Suggested Course/Exam Title",
  "description": "Short 2-sentence summary of exam topics.",
  "level": "Beginner | Intermediate | Advanced",
  "modules": [
    {
      "title": "Module 1: Key Topics Summary",
      "content": "Short markdown summary of tested concepts.",
      "estimatedMinutes": 15
    }
  ],
  "questions": [
    {
      "question": "Full question text",
      "options": [
        "A. Option 1",
        "B. Option 2",
        "C. Option 3",
        "D. Option 4"
      ],
      "correctAnswer": "A. Option 1",
      "explanation": "Concise rationale for the correct answer."
    }
  ]
}`;

    let promptContents: any[] = [];

    if (documentUrl) {
      try {
        const fileRes = await fetch(documentUrl);
        const arrayBuffer = await fileRes.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString("base64");
        
        let mimeType = "application/pdf";
        if (fileType?.includes("image") || documentUrl.match(/\.(png|jpe?g|webp)$/i)) {
          mimeType = fileType || "image/jpeg";
        } else if (fileType?.includes("pdf") || documentUrl.match(/\.pdf$/i)) {
          mimeType = "application/pdf";
        }

        promptContents = [
          systemPrompt,
          "Extract all questions, multiple-choice options, correct answers, and rationales:",
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
        ];
      } catch (fetchErr) {
        console.error("Failed to fetch uploaded document URL for OCR:", fetchErr);
        promptContents = [
          systemPrompt,
          `Analyze document URL (${documentUrl}) and convert into past questions JSON.`,
        ];
      }
    } else {
      promptContents = [
        systemPrompt,
        `Extract past questions JSON from text:\n\n${rawText}`,
      ];
    }

    // Call Gemini 3.6 Flash with responseMimeType JSON & temperature 0.2 for max speed
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptContents,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const responseText = response.text || "";
    
    const cleanJson = responseText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsedCourse;
    try {
      parsedCourse = JSON.parse(cleanJson);
    } catch (parseError) {
      console.warn("Raw Gemini AI response was not strict JSON, fallback parsing:", responseText);
      parsedCourse = {
        title: "Extracted Past Questions",
        description: "Generated from uploaded past question document.",
        level: "Intermediate",
        modules: [
          {
            title: "Module 1: Overview",
            content: responseText,
            estimatedMinutes: 15,
          },
        ],
        questions: [],
      };
    }

    return NextResponse.json({
      success: true,
      data: parsedCourse,
    });
  } catch (error: any) {
    console.error("Gemini OCR AI Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process document with Gemini AI OCR." },
      { status: 500 }
    );
  }
}
