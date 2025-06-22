"use server"

import { generateObject } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { z } from "zod"

// Initialize Groq client with API key (server-side only)
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

const analysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  suggestions: z.array(z.string()),
  sections: z.array(
    z.object({
      name: z.string(),
      score: z.number().min(0).max(100),
      feedback: z.string(),
    }),
  ),
  keywords: z.array(z.string()),
})

export async function analyzeResumeAction(resumeText: string) {
  try {
    // Use AI to analyze the resume
    const { object } = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: analysisSchema,
      prompt: `
        Analyze the following resume and provide detailed feedback:

        Resume Content:
        ${resumeText}

        Please provide:
        1. An overall score (0-100) based on completeness, formatting, and content quality
        2. List of strengths (3-5 items)
        3. List of weaknesses/areas for improvement (3-5 items)
        4. Specific actionable suggestions (5-7 items)
        5. Section-by-section analysis with scores and feedback for:
           - Contact Information
           - Professional Summary/Objective
           - Work Experience
           - Education
           - Skills
           - Additional Sections (if present)
        6. Important keywords and skills found in the resume

        Be constructive and specific in your feedback. Focus on actionable improvements.
      `,
    })

    return { success: true, data: object }
  } catch (error) {
    console.error("Resume analysis failed:", error)
    return { success: false, error: "Failed to analyze resume. Please try again." }
  }
}
