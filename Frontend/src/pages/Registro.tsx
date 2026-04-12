import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api/axios";

import styles from "../style/Registro.module.css"


export default function Registro(){
    const navigate = useNavigate();
    const [erro,setErro] = useState<string | null>(null);
    const [salvando,setSalvando] = useState(false);
    const [form, setForm] = useState({
        nome: '',
        cpf: '',
        dataNascimento: '',
        password: ''
    });

    function mudarEvento(evento:React.ChangeEvent<HTMLInputElement>){
        setForm({ ...form, [evento.target.name]: evento.target.value })
    }

    async function tratarEvento(evento:React.SubmitEvent){
        evento.preventDefault();
        setErro(null);
        setSalvando(true);

        try{
            await api.post('/usuarios/registrar', form);
            alert('Cadastro realizado com sucesso! Faça login.');
            navigate('/login');
        }catch (error: any){
            if (error.response?.status === 409 || error.response?.status === 500) {
                setErro('CPF já cadastrado.');
            } else if (error.response?.status === 400) {
                setErro('Dados inválidos. Verifique os campos.');
            } else {
                setErro('Erro ao realizar cadastro. Tente novamente.');
            }
        } finally {
            setSalvando(false);
        }
        }
    
        return(
            <> 
            <div className={styles.container}>
                <div className={styles.card}>
                    <h2 className={styles.titulo}>Criar conta</h2>

                <form 
                onSubmit={tratarEvento} 
                className={styles.form}>
                    <div 
                    className={styles.campo}>
                        <label 
                        className={styles.label}>
                            Nome completo
                        </label>

                        <input
                            className={styles.input}
                            type="text"
                            name="nome"
                            placeholder="Insira seu nome completo"
                            value={form.nome}
                            onChange={mudarEvento}
                            required
                        />
                    </div>

                    <div 
                    className={styles.campo}>
                        <label 
                        className={styles.label}>
                            CPF
                        </label>

                        <input
                            className={styles.input}
                            type="text"
                            name="cpf"
                            placeholder="00000000000"
                            value={form.cpf}
                            onChange={mudarEvento}
                            required
                        />
                    </div>

                    <div 
                    className={styles.campo}>
                        <label 
                        className={styles.label}>
                            Senha
                        </label>

                        <input
                            className={styles.input}
                            type="password"
                            name="password"
                            placeholder="Mínimo 6 caracteres"
                            value={form.password}
                            onChange={mudarEvento}
                            minLength={6}
                            required
                        />
                    </div>

                    <div 
                    className={styles.campo}>
                        <label 
                        className={styles.label}>
                            Data de nascimento
                        </label>

                        <input
                            className={styles.input}
                            type="date"
                            name="dataNascimento"
                            value={form.dataNascimento}
                            onChange={mudarEvento}
                            required
                        />
                    </div>

                    {erro && <p className={styles.erro}>{erro}</p>}

                    <button
                        type="submit"
                        className={styles.botao}
                        disabled={salvando}>
                        {salvando ? 'Cadastrando...' : 'Criar conta'}
                    </button>

                    <button
                        type="button"
                        className={styles.botaoSecundario}
                        onClick={() => navigate('/login')}>
                        Já tenho conta — Entrar
                    </button>
                    </form>
                </div>
            </div>

            </>
    );
}