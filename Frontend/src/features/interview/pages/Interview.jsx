import "../style/interview.css"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { useInterview } from "../hooks/useInterview"
import Navbar from "../../style/Navbar"

const tabs = [
    { id: "technical", label: "Technical Assessment" },
    { id: "behavioural", label: "Behavioural Assessment" },
    { id: "skillgaps", label: "Skill Gaps" },
    { id: "preparation", label: "Preparation Plan" },
]

const getMatchLabel = (score) => {
    if (score >= 80) return "STRONG FIT"
    if (score >= 60) return "GOOD FIT"
    if (score >= 40) return "MODERATE FIT"
    return "NEEDS WORK"
}

/**
 * Renders a circular SVG progress ring for the match score.
 */
const ScoreRing = ({ score }) => {
    const radius = 58
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (score / 100) * circumference

    return (
        <div className="iv-score-ring-wrapper">
            <svg className="iv-score-ring" viewBox="0 0 140 140">
                <circle className="iv-score-ring-bg" cx="70" cy="70" r={radius} />
                <circle
                    className="iv-score-ring-fill"
                    cx="70" cy="70" r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className="iv-score-ring-text">
                <span className="iv-score-value">{score}</span>
                <span className="iv-score-percent">%</span>
            </div>
        </div>
    )
}

const Interview = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("technical")
    const { report, getReportByID, loading, error } = useInterview();
    const data = report
    const { interviewID } = useParams()

    useEffect(() => {
        if (interviewID) {
            getReportByID(interviewID);
        }
    }, [interviewID, getReportByID])

    if (loading) {
        return (
            <main className="iv-loading-container">
                <div className="spinner spinner-lg"></div>
                <p>Loading your Interview Report...</p>
            </main>
        )
    }

    if (!report) {
        return (
            <main className="iv-error-container">
                <h2>Interview Report Not Found</h2>
                <p>{error || "Unable to find or load this interview report."}</p>
                <button className="button primary-button" onClick={() => navigate("/")}>
                    Back to Dashboard
                </button>
            </main>
        )
    }

    return (
        <div className="iv-page">
            <Navbar />

            {/* Main Layout */}
            <div className="iv-layout">
                {/* Left Sidebar — Match Score + Title */}
                <aside className="iv-sidebar">
                    <div className="iv-score-card">
                        <h3 className="iv-score-title">Overall Match Score</h3>
                        <ScoreRing score={data.matchScore} />
                        <div className="iv-score-label">{getMatchLabel(data.matchScore)}</div>
                    </div>

                    {data.title && (
                        <div className="iv-title-card">
                            <span className="iv-title-label">Position</span>
                            <span className="iv-title-value">{data.title}</span>
                        </div>
                    )}
                </aside>

                {/* Right Content */}
                <div className="iv-main">
                    {/* Tabs */}
                    <nav className="iv-tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`iv-tab ${activeTab === tab.id ? "iv-tab-active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    {/* Tab Content */}
                    <div className="iv-content">
                        {activeTab === "technical" && (
                            <section>
                                <h2 className="iv-section-title">
                                    <span className="iv-section-icon">◇</span> Technical Assessment
                                </h2>
                                <div className="iv-questions">
                                    {data.technicalQuestions.map((q, i) => (
                                        <div className="iv-question-card" key={i}>
                                            <span className="iv-question-badge">Question {i + 1}</span>
                                            <p className="iv-question-text">"{q.question}"</p>
                                            <p className="iv-question-meta">
                                                <strong>Intention:</strong> {q.intention}
                                            </p>
                                            <p className="iv-question-meta">
                                                <strong>Answer focus:</strong> {q.answer}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeTab === "behavioural" && (
                            <section>
                                <h2 className="iv-section-title">
                                    <span className="iv-section-icon">💬</span> Behavioural Assessment
                                </h2>
                                <div className="iv-questions">
                                    {data.behaviouralQuestions.map((q, i) => (
                                        <div className="iv-question-card" key={i}>
                                            <span className="iv-question-badge">Question {i + 1}</span>
                                            <p className="iv-question-text">"{q.question}"</p>
                                            <p className="iv-question-meta">
                                                <strong>Intention:</strong> {q.intention}
                                            </p>
                                            <p className="iv-question-meta">
                                                <strong>Answer focus:</strong> {q.answer}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeTab === "skillgaps" && (
                            <section>
                                <h2 className="iv-section-title">
                                    <span className="iv-section-icon">⚠</span> Skill Gaps
                                </h2>
                                <div className="iv-gaps">
                                    {data.skillGaps.map((gap, i) => (
                                        <div className="iv-gap-card" key={i}>
                                            <span className="iv-gap-name">{gap.skill}</span>
                                            <span className={`iv-gap-severity iv-severity-${gap.severity}`}>
                                                {gap.severity.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeTab === "preparation" && (
                            <section>
                                <h2 className="iv-section-title">
                                    <span className="iv-section-icon">📅</span> Preparation Plan
                                </h2>
                                <div className="iv-plan">
                                    {data.preparationPlan.map((day, i) => (
                                        <div className="iv-plan-card" key={i}>
                                            <div className="iv-plan-header">
                                                <span className="iv-plan-day">Day {day.day}</span>
                                                <span className="iv-plan-focus">{day.focus}</span>
                                            </div>
                                            <ul className="iv-plan-tasks">
                                                {day.tasks.map((task, j) => (
                                                    <li key={j}>{task}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Interview;