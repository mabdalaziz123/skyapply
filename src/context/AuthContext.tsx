import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface AuthContextType {
    isAuthenticated: boolean;
    username: string | null;
    role: 'admin' | 'blogger' | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [role, setRole] = useState<'admin' | 'blogger' | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            fetch(`${API_URL}/auth/verify`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.valid) {
                        setIsAuthenticated(true);
                        setUsername(data.user.username);
                        setRole(data.user.role);
                    } else {
                        localStorage.removeItem('admin_token');
                    }
                })
                .catch(() => localStorage.removeItem('admin_token'))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username: string, password: string) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'فشل تسجيل الدخول');
        localStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
        setUsername(data.username);
        setRole(data.role);
    };

    const logout = () => {
        localStorage.removeItem('admin_token');
        setIsAuthenticated(false);
        setUsername(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, role, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
