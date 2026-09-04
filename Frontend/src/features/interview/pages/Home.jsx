import "../style/home.css"
import { useInterview } from "../hooks/useInterview";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../style/Navbar";


const Home = () => {
    const { loading, generateReport, reports, getReports } = useInterview();
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [selectedFileName, setSelectedFileName] = useState("");
    const [formError, setFormError] = useState("");
    const resumeInputRef = useRef();

    const navigate = useNavigate();

    useEffect(() => {
        getReports();
    }, [getReports]);

    const getScoreBadgeClass = (score) => {
        if (typeof score !== "number") return "badge-neutral";
        if (score >= 80) return "badge-high";
        if (score >= 60) return "badge-medium";
        return "badge-low";
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        setSelectedFileName(file ? file.name : "");
        if (file) {
            setFormError("");
        }
    }

    const handleGenerateReport = async () => {
        setFormError("");
        const resumeFile = resumeInputRef.current?.files?.[0];

        if (!resumeFile) {
            setFormError("Please upload your resume (PDF).");
            return;
        }
        if (!jobDescription.trim()) {
            setFormError("Job description is required.");
            return;
        }
        if (!selfDescription.trim()) {
            setFormError("Self description is required.");
            return;
        }

        try {
            const data = await generateReport({ jobDescription, resumeFile, selfDescription });
            if (data?._id) {
                navigate(`/interview/${data._id}`);
            } else {
                setFormError("Unable to retrieve interview report. Please try again.");
            }
        } catch (err) {
            setFormError(err.message || "An unexpected error occurred while generating your report.");
        }
    }

    if (loading) {
        return (
            <main className="loading-page">
                <div className="spinner spinner-lg"></div>
                <p>Loading your dashboard...</p>
            </main>
        )
    }

    return (
        <main className="home">
            <Navbar />

            <div className="home-body">
                {/* Header */}
                <div className="home-header">
                    <h1>Create your Interview Plan with <span className="accent">AI</span></h1>
                    <p className="home-subtitle">
                        Provide the details below to generate a comprehensive, AI-driven interview preparation
                        report tailored to your target role.
                    </p>
                </div>

                {/* Error Banner */}
                {formError && (
                    <div className="home-error-banner">
                        {formError}
                    </div>
                )}

                {/* Main Content */}
                <div className="home-content">
                    {/* Left — Job Description */}
                    <div className="home-card home-card-left">
                        <div className="home-card-label">
                            <span className="home-card-icon">📋</span>
                            <span>Job Description <span className="required">*</span></span>
                        </div>
                        <p className="home-card-helper">
                            Paste the full job posting to ensure the AI analyzes specific requirements.
                        </p>
                        <textarea
                            onChange={(event) => {
                                setJobDescription(event.target.value);
                                if (formError) setFormError("");
                            }}
                            className="home-textarea"
                            name="jobDescription"
                            id="jobDescription"
                            placeholder="Enter Job Description Here..."
                        ></textarea>
                    </div>

                    {/* Right Column */}
                    <div className="home-right">
                        {/* Resume Upload */}
                        <div className="home-card">
                            <div className="home-card-label">
                                <span className="home-card-icon">📄</span>
                                <span>Resume <span className="required">*</span></span>
                                <span className="home-badge">Required for best results</span>
                            </div>
                            <label className="home-upload-zone" htmlFor="resume">
                                {selectedFileName ? (
                                    <>
                                        <span className="home-upload-icon">✓</span>
                                        <span className="home-upload-text" style={{ color: "rgb(134, 239, 172)" }}>{selectedFileName}</span>
                                        <span className="home-upload-hint">Click to replace selected file</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="home-upload-icon">☁</span>
                                        <span className="home-upload-text">Upload Resume</span>
                                        <span className="home-upload-hint">PDF only up to 5MB</span>
                                    </>
                                )}
                            </label>
                            <input
                                ref={resumeInputRef}
                                onChange={handleFileChange}
                                hidden
                                type="file"
                                name="resume"
                                id="resume"
                                accept=".pdf"
                            />
                        </div>

                        {/* Self Description */}
                        <div className="home-card home-card-grow">
                            <div className="home-card-label">
                                <span className="home-card-icon">✍</span>
                                <span>Self Description <span className="required">*</span></span>
                            </div>
                            <p className="home-card-helper">
                                Briefly highlight your key strengths or areas you want to emphasize.
                            </p>
                            <textarea
                                onChange={(event) => {
                                    setSelfDescription(event.target.value);
                                    if (formError) setFormError("");
                                }}
                                className="home-textarea"
                                name="selfDescription"
                                id="selfDescription"
                                placeholder="Describe yourself in a few sentences..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Generate Button */}
                <button onClick={handleGenerateReport}
                    className="home-generate-btn">Generate Interview Report</button>

                {/* Previous Reports Section */}
                <section className="home-reports-section">
                    <div className="home-reports-header">
                        <h2>Previous Reports</h2>
                        <span className="home-reports-subtitle">Your latest 5 generated interview plans</span>
                    </div>

                    {reports && reports.length > 0 ? (
                        <div className="home-reports-grid">
                            {reports.slice(0, 5).map((r) => (
                                <div
                                    key={r._id}
                                    className="home-report-box"
                                    onClick={() => navigate(`/interview/${r._id}`)}
                                >
                                    <div className="home-report-box-left">
                                        <span className="home-report-box-icon">📄</span>
                                        <div className="home-report-box-details">
                                            <h3 className="home-report-box-title">{r.title || "Interview Report"}</h3>
                                            {r.createdAt && (
                                                <span className="home-report-box-date">
                                                    {new Date(r.createdAt).toLocaleDateString(undefined, {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric"
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="home-report-box-right">
                                        <div className={`home-report-badge ${getScoreBadgeClass(r.matchScore)}`}>
                                            {typeof r.matchScore === "number" ? `${r.matchScore}% Match` : "N/A"}
                                        </div>
                                        <span className="home-report-arrow">→</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="home-reports-empty">
                            <p>No previous reports found. Generate your first report above!</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}

export default Home;