import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api/axios";
import type { UsuarioDto } from "../interfaces";

import styles from "../style/UsuariosForm.module.css";



export default function UsuarioForm(){

    const navigate = useNavigate();
    const {id} = useParams();
    const editando = !!id;
    const [erro,setErro] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [salvando, setSalvando] = useState(false);     
    const [form, setForm] = useState<UsuarioDto>({
        nome:'',
        cpf:'',
        dataNascimento:'',
        password:"",
    });

    useEffect(()=>{if (editando) {carregarUsuario();}}, [id]);
    

    async function carregarUsuario(){
        setCarregando(true);
        try{
            const response = await api.get<UsuarioDto>(`/usuarios/${id}`);
            setForm({
                ...response.data,
                password:'',
            });

        }catch(error){
            setErro("Erro ao carregar usuário")

        }finally{
            setCarregando(false);
        }
    };

    function mudarEvento(evento:React.ChangeEvent<HTMLInputElement>){
        setForm({...form, [evento.target.name] : evento.target.value});
    }

    async function tratarEvento(evento:React.SubmitEvent){
        evento.preventDefault();
        setErro(null);
        setSalvando(true);

    try{
        if (editando){
            await api.put(`/usuarios/${id}`, form)
        }else{
            await api.post(`/usuarios`, form)
        }
        navigate("/usuarios");

    }catch(error:any){
        if (error.response?.status === 400){
            setErro("Preencha seus dados corretamente");
        }else if(error.response?.status === 409){
            setErro("cpf já cadastrado");
        }else{
            setErro("Erro ao salvar usuário");
        }

    }finally{
        setSalvando(false);
    }
}

    if (carregando){
        return <p className={styles.mensagem}>Carregando</p>;
    }


    return(
        <>
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <button
                    className={styles.botaoVoltar}
                    onClick={() => navigate('/usuarios')}>
                        ← Voltar
                    </button>

                    <h2 className={styles.titulo}>
                        {editando ? 'Editar usuário' : 'Novo usuário'}
                    </h2>
                </div>

                <form onSubmit={tratarEvento} className={styles.form}>
                    <div className={styles.campo}>
                        <label
                        className={styles.label}>
                            Nome completo
                        </label>
                        <input
                            className={styles.input}
                            type="text"
                            name="nome"
                            placeholder="Digite o nome completo"
                            value={form.nome}
                            onChange={mudarEvento}
                            required
                        />
                    </div>

                <div className={styles.campo}>
                    <label 
                    className={styles.label}>
                        CPF
                    </label>
                        <input
                            className={`${styles.input} ${editando ? styles.inputEditando : ''}`}
                            type="text"
                            name="cpf"
                            placeholder="000.000.000-00"
                            value={form.cpf}
                            onChange={mudarEvento}
                            disabled={editando}
                            required
                        />
                        {editando && (
                            <span className={styles.dica}>CPF não pode ser alterado.</span>
                        )}
                </div>

                    <div className={styles.campo}>
                        <label className={styles.label}>
                            Data de nascimento
                        </label>
                        <input
                            className={styles.input}
                            type="date"
                            name="dataNascimento"
                            value={String(form.dataNascimento)}
                            onChange={mudarEvento}
                            required
                        />
                    </div>

                    <div className={styles.campo}>
                        <label 
                        className={styles.label}>
                        {editando ? 'Nova senha' : 'Senha'}
                        </label>
                        <input
                            className={styles.input}
                            type="password"
                            name="password"
                            placeholder={editando ? 'Digite para alterar a senha' : 'Digite a senha'}
                            value={form.password ?? ''}
                            onChange={mudarEvento}
                            required={!editando}
                        />
                    </div>

                    {erro && <p className={styles.erro}>{erro}</p>}


                    <div className={styles.acoes}>
                        <button
                            type="button"
                            className={styles.botaoCancelar}
                            onClick={() => navigate('/usuarios')}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`${styles.botaoSalvar} ${salvando ? styles.botaoSalvando : ''}`}
                        >
                        {salvando ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form> 
            </div>
        </div>
        
        </>
    );
}