import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true
})

/**
 * @description Service to Generate Interview Report based on User Self Description, Job Description and Resume
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data;
}

/**
 * @description Service to get Inteview Report by InterviewID
 */
export const getInterviewReportByID = async (interviewID) => {
    const response = await api.get(`/api/interview/report/${interviewID}`);

    return response.data;
}

/**
 * @description Service to get All Interview Report of Logged In User
 */
export const getAllInterviewReports = async () => {
    const response = await api.get(`/api/interview/`);

    return response.data;
}