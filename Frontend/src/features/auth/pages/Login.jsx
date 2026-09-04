import "../auth.form.css"
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const Login = () => {
    const navigate = useNavigate();

    const { loading, handleLogin } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!email.trim() || !password.trim()) {
            setError("Please provide both email and password.");
            return;
        }

        const success = await handleLogin({ email, password });
        if (success) {
            navigate("/");
        } else {
            setError("Invalid credentials or login failed. Please try again.");
        }
    }

    if (loading) {
        return (
            <main className="loading-page">
                <div className="spinner spinner-lg"></div>
                <p>Authenticating...</p>
            </main>
        )
    }

    return (
        <main className="auth-page">
            <div className="animated-bg"></div>

            <div className="form-container">
                {/* Brand Header */}
                <div className="auth-brand">
                    <img src="/interviewready_ai_logo.png" alt="InterviewReady AI" className="auth-brand-logo-img" />
                    <h2 className="auth-brand-name">InterviewReady <span className="ai">AI</span></h2>
                    <p className="auth-brand-tagline">
                        AI-driven resume appraisal, gap analysis, and personalized interview readiness roadmap
                    </p>
                </div>

                <h1>Welcome Back</h1>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(event) => {
                                setEmail(event.target.value);
                                if (error) setError("");
                            }}
                            type="email" id="email"
                            name="email" placeholder="you@example.com" />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(event) => {
                                setPassword(event.target.value);
                                if (error) setError("");
                            }} type="password" id="password"
                            name="password" placeholder="Enter your password" />
                    </div>

                    <button type="submit" className="button primary-button">Sign In</button>
                </form>

                <p>Don't have an account? <Link to={"/register"}>Create one</Link></p>
            </div>
        </main>
    )
}

export default Login;