import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './security/AuthContext';
import { PrivateRoute } from './route/privateroute';

import Login from "./pages/Login";
import Usuarios from './pages/Usuarios';
import UsuariosForm from './pages/UsuariosForm';
import UsuariosDetails from './pages/UsuariosDetails';
import Enderecos from './pages/Enderecos';
import UsuarioForm from './pages/UsuariosForm';
import Registro from './pages/Registro';

export default function App() {

  return (
    <>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
           path="/login"
           element={<Login/>}
          />

          <Route 
          path="/registro" 
          element={<Registro/>}
           />

          <Route path="/usuarios" element={
            <PrivateRoute role="ROLE_ADMIN">
              <Usuarios/>
            </PrivateRoute>
          }/>
     
          <Route path="/usuarios/novo" element={
            <PrivateRoute role="ROLE_ADMIN">
              <UsuariosForm/>
          </PrivateRoute>
          } />

          <Route path="/usuarios/:id/editar" element={
            <PrivateRoute role="ROLE_ADMIN">
              <UsuarioForm />
          </PrivateRoute>
          } />

          <Route path="/usuarios/:id" element={
            <PrivateRoute>
              <UsuariosDetails/>
            </PrivateRoute>
          } />

          <Route path="/usuarios/:id/enderecos" element={
            <PrivateRoute>
              <Enderecos/>
            </PrivateRoute>
          }/>

          <Route path="/" element={<Navigate to="login" replace/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </>
  );
};