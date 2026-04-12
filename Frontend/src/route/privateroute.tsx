import { Navigate } from 'react-router-dom';
import  { useAuth } from '../security/AuthContext';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
    children: ReactNode;
    role?: string;
}

export function PrivateRoute({ children, role }: PrivateRouteProps) {
    const { auth } = useAuth();

    if (!auth) {
        return <Navigate to="/login" replace />;
    }

    if (role && auth.role !== role) {
        return <Navigate to={`/usuarios/${auth.id}`} replace />;
    }

    return <>{children}</>;
}