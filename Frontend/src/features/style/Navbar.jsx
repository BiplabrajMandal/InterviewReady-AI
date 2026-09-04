import "./navbar.css";
import { useAuth } from "../auth/hooks/useAuth";
import { useNavigate } from "react-router";

const Navbar = () => {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();

    const onLogout = async () => {
        await handleLogout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <div className="navbar-brand" onClick={() => navigate("/")}>
                    <img src="/interviewready_ai_logo.png" alt="InterviewReady AI" className="navbar-logo-img" />
                    <span className="navbar-name">InterviewReady <span className="navbar-name-ai">AI</span></span>
                </div>

                <div className="navbar-right">
                    {user && (
                        <>
                            <span className="navbar-greeting">
                                Hello, <strong>{user.username}</strong>
                            </span>
                            <button className="navbar-logout-btn" onClick={onLogout}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
