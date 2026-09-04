const mongoose = require("mongoose");

/**
 * - Job Description : String
 * - Resume Text : String
 * - Self Description : String
 * 
 * - matchScore : Number
 * 
 * -Technical Question : [{
 *                          question: "",
 *                          intention: "",
 *                          answer: ""
 *                       }]
 * - Behavioural Question : [{
 *                            question: "",
 *                            intention: "",
 *                            answer: ""
 *                         }]
 * - Skill Gaps : [{
 *                  skill : "",
 *                  severity : "",
 *                  type: "",
 *                  enum: ""
 *                }]
 * - Preparation Plan: [{
 *                        day : Number,
 *                        focus : String,
 *                        tasks : [String]
 *                     }]
 */

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical Question is Required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is Required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is Required"]
    }
}, {
    _id: false
})

const behaviouralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Behavioural Question is Required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is Required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is Required"]
    }
}, {
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is Required"]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is Required"]
    }
}, {
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is Required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is Required"]
    },
    tasks: [{
        type: String,
        required: [true, "Task is Required"]
    }]
}, {
    _id: false
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job Description is Required"]
    },
    resume: {
        type: String
    },
    selfDescription: {
        type: String
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },
    technicalQuestions: [technicalQuestionSchema],
    behaviouralQuestions: [behaviouralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    title: {
        type: String,
        required: [true, "Job Title is Required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
}, {
    timestamps: true
})

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;