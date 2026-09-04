import { AuthContext } from "../auth.context.jsx";
import { useContext } from "react";
import { register, login, logout } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            setUser(data.user);
            return true;
        } catch (error) {
            console.log("Registration failed:", error);
            return false;
        } finally {
            setLoading(false);
        }
    }

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            setUser(data.user);
            return true;
        } catch (error) {
            console.log("Login failed:", error);
            return false;
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.log("Logout failed:", error);
        } finally {
            setLoading(false);
        }
    }

    return { user, loading, handleLogin, handleLogout, handleRegister };
}