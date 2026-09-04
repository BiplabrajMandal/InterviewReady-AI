const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user Resume, Self Description and Job Description
 * @access Private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController);


/**
 * @route GET /api/interview/report/:interviewID
 * @description get Interview Report by InterviewID
 * @access Private
 */
interviewRouter.get("/report/:interviewID", authMiddleware.authUser, interviewController.getInterviewReportByIDController);

/**
 * @route GET /api/interview
 * @description get all Inteview Report of Logged In User
 * @access Private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)


module.exports = interviewRouter;