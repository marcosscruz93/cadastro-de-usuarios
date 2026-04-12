import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../security/AuthContext';

import api from "../services/api/axios";
import type { UsuarioDto } from '../interfaces';

import styles from "../style/UsuariosDetails.module.css"

export default function UsuariosDetails(){
    const navigate = useNavigate();
    const {id} = useParams();
    const {auth, logout} = useAuth();
    const [usuario,setUsuario] = useState<UsuarioDto | null>(null);
    const [carregando,setCarregando] = useState(true);
    const [erro,setErro] = useState<string | null>(null);
    const isAdmin = auth?.role === "ROLE_ADMIN";

    
    useEffect(() => {if (!isAdmin && auth?.id !== Number(id))
        {navigate(`/usuarios/${auth?.id}`);
        return;
    }       
    carregarUsuario();
    }, [id]);

    async function carregarUsuario(){
        setCarregando(true);
        try {
            const response = await api.get<UsuarioDto>(`/usuarios/${id}`);
            setUsuario(response.data);
        }catch(error){
            setErro("Não foi possível carregar usuário");
        }finally{
            setCarregando(false);
        }
    }
    
    async function handleDeletarConta() {
    if (!confirm('Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.')) {
        return;
    }try{
        await api.delete(`/usuarios/${id}`);
        logout();
        navigate('/login');
    }catch (error) {
        alert('Erro ao deletar conta.');
    };
}

    

    function formatarData(data: string) {
        return new Date(data).toLocaleDateString('pt-BR');
    }   

    function formatarCpf(cpf: string) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,'$1.$2.$3-$4');
    }

    if (carregando) return <p className={styles.mensagem}>Carregando</p>;
    if (erro) return <p className={styles.erro}>{erro}</p>;
    if (!usuario) return null;

    return(
        <>
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    {isAdmin && (
                    <button
                        className={styles.botaoVoltar}
                        onClick={() => navigate(isAdmin ? '/usuarios' : `/usuarios/${id}`)}
                    >
                        ← Voltar
                    </button>
                    )}
                    <h2 
                    className={styles.titulo}>
                        Perfil do usuário
                    </h2>


                    <button
                    className={styles.botaoSair}
                    onClick={() => { logout(); navigate('/login'); }}>
                        Sair
                    </button>                    
                </div>

                <div className={styles.perfil}>
                    <div className={styles.avatar}>
                        {usuario.nome.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <p className={styles.nomeDestaque}>{usuario.nome}</p>
                        <span 
                        className={styles.badge}>
                        {usuario.role?.toUpperCase().includes('ADMIN') ? 'Administrador' : 'Usuário'}                        </span>
                    </div>
                </div>

                <div className={styles.secao}>
                    <h3 className={styles.secaoTitulo}>Dados pessoais</h3>

                    <div className={styles.grid}>
                        <div className={styles.campo}>
                            <span 
                            className={styles.campoLabel}>
                                Nome completo
                            </span>

                            <span 
                            className={styles.campoValor}>
                                {usuario.nome}
                            </span>

                        </div>

                        <div className={styles.campo}>
                            <span 
                            className={styles.campoLabel}>CPF</span>
                            <span 
                            className={styles.campoValor}>
                                {formatarCpf(usuario.cpf)}
                            </span>
                        </div>

                        <div className={styles.campo}>
                            <span 
                            className={styles.campoLabel}>
                                Data de nascimento
                            </span>

                            <span 
                            className={styles.campoValor}>
                                {formatarData(String(usuario.dataNascimento))}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.secao}>
                    <h3 className={styles.secaoTitulo}>Endereços</h3>
                    {usuario.enderecos && usuario.enderecos.length > 0 ? (
                        usuario.enderecos.map((endereco) => (
                            <div 
                            key={endereco.id} 
                            className={styles.enderecoCard}>
                                <div className={styles.enderecoHeader}>
                                    <span 
                                    className={styles.enderecoRua}>
                                        {endereco.logradouro}, {endereco.numero}
                                        {endereco.complemento && ` - ${endereco.complemento}`}
                                    </span>

                                    {endereco.enderecoPadrao && (
                                        <span 
                                        className={styles.badgePadrao}>
                                            Principal
                                        </span>
                                    )}

                                </div>

                                <span 
                                className={styles.enderecoDetalhe}>
                                    {endereco.bairro} — {endereco.cidade}/{endereco.estado}
                                </span>

                                <span 
                                className={styles.enderecoCep}>
                                    CEP: {endereco.cep}
                                </span>
                            </div>
                        ))
                    ) : (<p 
                        className={styles.semEnderecos}>
                            Nenhum endereço cadastrado.
                        </p>
                    )}
                </div>

                <div className={styles.acoes}>
                    {isAdmin && (
                        <button
                            className={styles.botaoEditar}
                            onClick={() => navigate(`/usuarios/${id}/editar`)}
                        >
                            Editar usuário
                        </button>
                    )}
                    <button
                        className={styles.botaoEnderecos}
                        onClick={() => navigate(`/usuarios/${id}/enderecos`)}
                    >
                        Gerenciar endereços
                    </button>

                    <button
                        className={styles.botaoDeletar}
                        onClick={handleDeletarConta}
                    >
                        Deletar conta
                    </button>
                </div>
            </div>
        </div>
               
        </>
    );
}