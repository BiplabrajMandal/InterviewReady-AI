import { useState } from "react";
import "../auth.form.css"
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
    const navigate = useNavigate(); 

    const { loading, handleRegister } = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!username.trim() || !email.trim() || !password.trim()) {
            setError("Please fill in all fields.");
            return;
        }

        const success = await handleRegister({ username, email, password });
        if (success) {
            navigate("/");
        } else {
            setError("Registration failed. Please check your details and try again.");
        }
    }

    if (loading) {
        return (
            <main className="loading-page">
                <div className="spinner spinner-lg"></div>
                <p>Creating your account...</p>
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

                <h1>Create Account</h1>
                
                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input  
                            onChange={(event) => {
                                setUsername(event.target.value);
                                if (error) setError("");
                            }} type="text" id="username" 
                            name="username" placeholder="Choose a username"/>
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input  
                            onChange={(event) => {
                                setEmail(event.target.value);
                                if (error) setError("");
                            }}
                            type="email" id="email" 
                            name="email" placeholder="you@example.com"/>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input  
                            onChange={(event) => {
                                setPassword(event.target.value);
                                if (error) setError("");
                            }}
                            type="password" id="password" 
                            name="password" placeholder="Create a strong password"/>
                    </div>

                    <button type="submit" className="button primary-button">Create Account</button>
                </form>

                <p>Already have an account? <Link to={"/login"}>Sign in</Link></p>
            </div>
        </main>
    )
}

export default Register;