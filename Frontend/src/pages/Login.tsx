import { useState, useEffect, type SubmitEvent} from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../security/AuthContext"

import api from "../services/api/axios"
import type { LoginRequest, LoginResponse } from "../interfaces"

import styles from "../style/Login.module.css";

export default function Login(){

    const navigate = useNavigate();
    const {login} = useAuth();
    const [erro, setErro] = useState<string | null>(null);
    const [carregando,setCarregando] = useState(false);
    const [visivel,setVisivel] = useState(false);
    const [form,setForm] = useState<LoginRequest>({
        cpf:'',
        password:''
    });

    useEffect(() => {
        const timer = setTimeout(() => setVisivel(true), 100);
        return () => clearTimeout(timer);
    }, []);


    function mudarEvento(evento: React.ChangeEvent<HTMLInputElement>){
        setForm({...form, [evento.target.name]: evento.target.value})
    }

    

    async function tratarEvento(evento:SubmitEvent<HTMLFormElement>){
        evento.preventDefault();
        evento.stopPropagation();
        setErro(null);
        setCarregando(true);

        try {
            const response = await api.post<LoginResponse>('/auth/login', form);
            login(response.data);

            if (response.data.role === 'ROLE_ADMIN') {
                navigate('/usuarios');
            } else {
                navigate(`/usuarios/${response.data.id}`);
            }
            
        }catch (error: any) {
            if (error.response && error.response.status === 401) {
                setErro('CPF ou senha inválidos.');
            } else {
                setErro('Erro ao tentar conectar com o servidor.');
            }
        }finally {
            setCarregando(false);
        }
}


    return(
        <>
        <div className={styles.container}>
            <div className={`${styles.card} ${visivel ? styles.cardVisivel : styles.cardOculto}`} >

                <div className={styles.boasVindas}>
                    <h1 className={styles.heading}>Seja bem-vindo ao CGUC</h1>
                </div>

                <h2 className={styles.titulo}>Entrar</h2>

                <form
                onSubmit={tratarEvento}
                className={styles.form}>
                
                <div className={styles.campo}>
                    <label className={styles.label}>CPF</label>
                    <input
                        className={styles.input}
                        type="text"
                        name="cpf"
                        placeholder="Insira seu cpf"
                        value={form.cpf}
                        onChange={mudarEvento}
                        required
                    />

                </div>

                <div className={styles.campo}>
                    <label className={styles.label}>Password</label>
                    <input
                        className={styles.input}
                        type="password"
                        name="password"
                        placeholder="Insira sua senha"
                        value={form.password}
                        onChange={mudarEvento}
                        required
                    />
                </div>
                {erro && (
                    <p className={styles.erro}>{erro}</p>
                )}

                <button
                    className={`${styles.botao} ${carregando? styles.botaoCarregando:""}`}
                    type="submit"
                    disabled={carregando}
                >
                    {carregando ? "entrando": "Logar"}
                </button>
                </form>
                <button
                    className={styles.botaoRegistro}
                    onClick={() => navigate('/registro')}>
                Não tenho conta — Criar conta
                </button>
            </div>
        </div>
        </>
    ) 
};