const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

/**
 * @name getInterviewReportSchema
 * @description Returns the Gemini-compatible JSON schema for the Interview Report
 * @returns {Object} The JSON schema object
 */
function getInterviewReportSchema() {
    return {
        type: "object",
        properties: {
            matchScore: {
                type: "number",
                description: "A Score between 0 and 100 indicating how well the Candidate's Profile matches the Job Description"
            },
            technicalQuestions: {
                type: "array",
                description: "The Technical Questions that can be asked in the Interview along with their Intention and how to Answer them",
                items: {
                    type: "object",
                    properties: {
                        question: { type: "string", description: "The Technical Question that can be asked in the Interview" },
                        intention: { type: "string", description: "The Intention of the Interviewer behind asking this Question" },
                        answer: { type: "string", description: "How to answer this question, what points to cover, what approach to take" }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            behaviouralQuestions: {
                type: "array",
                description: "The Behavioural Questions that can be asked in the Interview along with their Intention and how to Answer them",
                items: {
                    type: "object",
                    properties: {
                        question: { type: "string", description: "The Behavioural Question that can be asked in the Interview" },
                        intention: { type: "string", description: "The Intention of the Interviewer behind asking this Question" },
                        answer: { type: "string", description: "How to answer this question, what points to cover, what approach to take" }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            skillGaps: {
                type: "array",
                description: "List of Skill Gaps in the Candidate's Profile along with their Severity",
                items: {
                    type: "object",
                    properties: {
                        skill: { type: "string", description: "The Skill which the Candidate is Lacking" },
                        severity: { type: "string", enum: ["low", "medium", "high"], description: "The Severity of the Skill Gap" }
                    },
                    required: ["skill", "severity"]
                }
            },
            preparationPlan: {
                type: "array",
                description: "A day-wise preparation plan for the candidate to prepare for the interview effectively",
                items: {
                    type: "object",
                    properties: {
                        day: { type: "number", description: "The day number in the preparation plan, starting from 1" },
                        focus: { type: "string", description: "The main focus area for that day, e.g. data structures, system design, mock interviews" },
                        tasks: {
                            type: "array",
                            description: "List of tasks to be done on this day",
                            items: { type: "string" }
                        }
                    },
                    required: ["day", "focus", "tasks"]
                }
            },
            title: {
                type: "string",
                description: "The Title of the Job for which Interview Report is Generated"
            }
        },
        required: ["matchScore", "technicalQuestions", "behaviouralQuestions", "skillGaps", "preparationPlan", "title"]
    }
}

const CANDIDATE_MODELS = [
    "gemini-3.6-flash",
    "gemini-3.5-flash-lite",
    "gemini-3-flash-preview"
];

function cleanAndParseJSON(rawText) {
    if (!rawText || typeof rawText !== "string") {
        throw new Error("Empty response received from AI model");
    }
    let cleaned = rawText.trim();
    if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }
    return JSON.parse(cleaned);
}

/**
 * @name generateInterviewReport
 * @description Generates an Interview Report using Gemini AI based on Resume, Self Description and Job Description
 * @param {Object} params - { resume, selfDescription, jobDescription }
 * @returns {Object} The parsed interview report from AI
 */
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an Interview Report for a Candidate with the following Details: 
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}`;

    let lastError = null;

    for (const model of CANDIDATE_MODELS) {
        try {
            const response = await ai.models.generateContent({
                model,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: getInterviewReportSchema()
                }
            });

            return cleanAndParseJSON(response.text);
        } catch (error) {
            console.warn(`Model ${model} failed: ${error.message}. Attempting fallback if available.`);
            lastError = error;
        }
    }

    throw new Error(`AI generation failed across all models: ${lastError?.message || "Unknown error"}`);
}

module.exports = generateInterviewReport;