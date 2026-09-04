const pdfParse = require("pdf-parse");
const mongoose = require("mongoose");
const generateInterviewReport = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate Interview Report based on User Self Description, Resume and Job Description
 */
async function generateInterviewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Resume file is required" });
        }

        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({
                message: "Job Description is required"
            });
        }

        if (!selfDescription || !selfDescription.trim()) {
            return res.status(400).json({
                message: "Self Description is required"
            });
        }

        let resumeContent;
        try {
            const parser = new pdfParse.PDFParse(Uint8Array.from(req.file.buffer));
            resumeContent = await parser.getText();
        } catch (pdfErr) {
            return res.status(400).json({
                message: "Unable to parse resume PDF. Please ensure the file is a valid, unencrypted PDF: " + pdfErr.message
            });
        }

        let interviewReportByAI;
        try {
            interviewReportByAI = await generateInterviewReport({
                resume: resumeContent.text,
                selfDescription,
                jobDescription
            });
        } catch (aiErr) {
            return res.status(502).json({
                message: "AI Generation failed: " + aiErr.message
            });
        }

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAI
        });

        res.status(201).json({
            message: "Interview Report Generated Successfully",
            interviewReport
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to generate interview report: " + error.message
        });
    }
}

/**
 * @description Controller to get Interview Report by InterviewID
 */
async function getInterviewReportByIDController(req, res) {
    try {
        const { interviewID } = req.params;

        if (!mongoose.Types.ObjectId.isValid(interviewID)) {
            return res.status(400).json({
                message: "Invalid Interview ID"
            });
        }

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewID,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview Report not Found"
            });
        }

        res.status(200).json({
            message: "Interview Report fetched Successfully",
            interviewReport
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve interview report: " + error.message
        });
    }
}

/**
 * @description Controller to get all Interview Reports of Logged In User
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behaviouralQuestions -skillGaps -preparationPlan");

        res.status(200).json({
            message: "Interview Reports fetched Successfully",
            interviewReports
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch interview reports: " + error.message
        });
    }
}

module.exports = {
    generateInterviewReportController,
    getInterviewReportByIDController,
    getAllInterviewReportsController
}