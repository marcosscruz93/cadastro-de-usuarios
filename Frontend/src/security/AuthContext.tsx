import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, LoginResponse } from "../interfaces/index";


interface AuthContextType {
    auth: AuthState | null;
    login: (dados: LoginResponse) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [auth, setAuth] = useState<AuthState | null>(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const id = localStorage.getItem('id');
        const nome = localStorage.getItem('nome');

        if (token && role && id && nome) {
            return { token, role, id: Number(id), nome };
        }
        return null;
    });

    function login(dados: LoginResponse) {
        localStorage.setItem('token', dados.token);
        localStorage.setItem('role', dados.role);
        localStorage.setItem('id', String(dados.id));
        localStorage.setItem('nome', dados.nome);
        setAuth(dados);
    }

    function logout() {
        localStorage.clear();
        setAuth(null);
    }

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro do AuthProvider');
    }
    return context;
}