import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../security/AuthContext"

import api from "../services/api/axios"
import type { UsuarioDto } from "../interfaces"

import styles from "../style/Usuarios.module.css"


export default function Usuarios(){

    const navigate = useNavigate();
    const {auth, logout} = useAuth();
    const [usuarios, setUsuarios] = useState<UsuarioDto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [visivel,setVisivel] = useState(false);
    
    useEffect(() => {
        carregarUsuarios();
        const timer = setTimeout(() => setVisivel(true), 100);
        return () => clearTimeout(timer);
    }, []);

    async function carregarUsuarios(){
        
        try{
            const response = await api.get<UsuarioDto[]>("/usuarios");
            setUsuarios(response.data);
        }catch(error){
            setErro("Não foi possível carregar o usuário");
        }finally{
            setCarregando(false);
        }

    };

    async function excluirEvento(id:number){
        if (!confirm("Realmente deseja excluir esse usuário?"))
        return;

        try{
            await api.delete(`/usuarios/${id}`);
            setUsuarios(usuarios.filter((usuario)=>usuario.id !== id));
        }catch(error){
            alert("Erro ao tentar excluir usuário")
        }

}
        function saudacao(){
            const hora = new Date().getHours();
            if (hora >= 6 && hora < 12) return "Bom dia";
            if (hora >= 12 && hora < 18) return "Boa tarde";
            return "Boa noite";        
    };


    return (
        <>
        <div
        className={styles.container}>
            <div
             className={`${styles.header} ${visivel ? styles.cardVisivel : styles.cardOculto}`}>
                <h2
                 className={styles.titulo}>
                    Cadastro de usuários
                </h2>
                
                <div
                 className={styles.headerAcoes}>

                    <span
                    className={styles.bemVindo}>
                    {saudacao()}, {auth?.nome}!
                    </span>

                    <button
                        className={styles.botaoNovo}
                        onClick={() => navigate('/usuarios/novo')}
                    >
                    + Novo usuário
                    </button>

                    <button
                     className={styles.botaoSair}
                     onClick={logout}>
                        Sair
                    </button>
                </div>
            </div>

            {carregando && <p
             className={styles.mensagem}>
                Carregando
                </p>
            }

            {erro && <p
             className={styles.erro}>
                {erro}
                </p>
            }

            {!carregando && !erro && (
                <div 
                className={`${styles.tabela} ${visivel ? styles.cardVisivel : styles.cardOculto}`}>
                    <div
                    className={styles.tabelaHeader}>
                        <span
                        className={styles.colNome}>Nome
                        </span>

                        <span
                        className={styles.colCpf}>CPF
                        </span>

                        <span
                        className={styles.colNasc}>Nascimento
                        </span>

                        <span 
                        className={styles.colAcoes}>Ações
                        </span>
                    </div>
            
            {usuarios.length === 0 && (
                <p
                className={styles.mensagem}>
                    Nenhum usuário cadastrado.
                </p>
            )}

            {usuarios.map((usuario) => (
                <div key={usuario.id}
                className={styles.tabelaLinha}>

                    <span 
                    className={styles.colNome}>
                        {usuario.nome}
                    </span>

                    <span 
                    className={styles.colCpf}>
                        {usuario.cpf}
                    </span>

                    <span 
                    className={styles.colNasc}>
                        {new Date(usuario.dataNascimento).toLocaleDateString('pt-BR')}
                    </span>

                    <div className={styles.colAcoes}>
                        <button
                        className={styles.botaoVer}
                        onClick={()=>navigate(`/usuarios/${usuario.id}`)}>
                                    Ver
                        </button>

                        <button
                        className={styles.botaoEditar}
                        onClick={() => navigate(`/usuarios/${usuario.id}/editar`)}>
                        Editar
                        </button>

                        <button
                        className={styles.botaoEnderecos}
                        onClick={() => navigate(`/usuarios/${usuario.id}/enderecos`)}>
                                    Endereços
                        </button>

                        <button
                        className={styles.botaoExcluir}
                        onClick={() => excluirEvento(usuario.id!)}>
                                    Excluir
                        </button>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
    </>
    );
};