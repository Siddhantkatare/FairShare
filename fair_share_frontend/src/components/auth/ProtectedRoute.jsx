import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState(() => {
        const data = localStorage.getItem('loginData');
        return data ? JSON.parse(data) : null;
    });
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    const isTokenExpired = () => {
        if (!loginData?.token) return true;

        try {
            const payload = JSON.parse(atob(loginData.token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch (error) {
            console.error("Token decode error:", error);
            return true;
        }
    };

    useEffect(() => {
        if (isTokenExpired()) {
            localStorage.removeItem('loginData');
            setLoginData(null);
            setIsAuthenticated(false);
            // Navigate with state to show login modal
            navigate('/home', {
                state: { showLogin: true },
                replace: true
            });
        } else {
            setIsAuthenticated(true);
        }
    }, [navigate]);

    if (isAuthenticated === null) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/home" state={{ showLogin: true }} replace />;

    return <Outlet />;
};

export default ProtectedRoute;
