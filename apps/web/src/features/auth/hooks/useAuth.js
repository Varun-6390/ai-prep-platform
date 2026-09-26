import { Authcontext } from "../auth.context";
import { useContext, useEffect } from "react";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {

    const context = useContext(Authcontext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            if (data && data.user) {
                setUser(data.user)
                return { success: true }
            }
            return { success: false, message: "Invalid response from server" }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || error.message || "Login failed" }
        }
        finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            if (data && data.user) {
                setUser(data.user)
                return { success: true }
            }
            return { success: false, message: "Invalid response from server" }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || error.message || "Registration failed" }
        }
        finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
            return { success: true }
        } catch (error) {
            return { success: false, message: "Logout failed" }
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const getAndsetUser = async() =>{
            try {
                const data = await getMe()
                if (data && data.user) {
                    setUser(data.user)
                } else {
                    setUser(null)
                }
            } catch (error) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getAndsetUser()
    },[])

    return { user, loading, handleLogin, handleLogout, handleRegister }
}



