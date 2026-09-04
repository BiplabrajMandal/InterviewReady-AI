import { getAllInterviewReports, getInterviewReportByID, generateInterviewReport } from "../services/interview.api.js"
import { useContext, useCallback } from "react"
import { InterviewContext } from "../interview.context.jsx"

export const useInterview = () => {
    const context = useContext(InterviewContext)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports, setReports, error, setError } = context;

    const generateReport = useCallback(async ({ jobDescription, resumeFile, selfDescription }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await generateInterviewReport({ jobDescription, resumeFile, selfDescription });
            setReport(response.interviewReport);
            return response.interviewReport;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to generate interview report";
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, setReport]);

    const getReportByID = useCallback(async (interviewID) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getInterviewReportByID(interviewID);
            setReport(response.interviewReport);
            return response.interviewReport;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to load interview report";
            setError(message);
            setReport(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, setReport]);

    const getReports = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllInterviewReports();
            setReports(response.interviewReports);
            return response.interviewReports;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to load interview reports";
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, setReports]);

    return { loading, report, reports, error, generateReport, getReportByID, getReports }
}