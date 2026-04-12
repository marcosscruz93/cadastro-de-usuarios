import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../security/AuthContext";

import api from "../services/api/axios";
import type { EnderecoDto, ViaCepDto } from "../interfaces";

import styles from "../style/Enderecos.module.css"

export default function Enderecos() {

    const navigate = useNavigate();
    const {id} = useParams();
    const {auth} = useAuth();
    const [enderecos, setEnderecos] = useState<EnderecoDto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro,setErro] = useState<string | null>(null);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [salvando,setSalvando] = useState(false);
    const [buscandoCep, setBuscandoCep] = useState(false);
    const [enderecoEditando, setEnderecoEditando] = useState<EnderecoDto | null>(null);
    const formVazio: EnderecoDto={
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        enderecoPadrao: false
    };

    const [form, setForm] = useState<EnderecoDto>(formVazio);
    const isAdmin = auth?.role == "ROLE_ADMIN";

    useEffect(()=>{if (!isAdmin && auth?.id !== Number(id)){
            navigate(`/usuarios/${auth?.id}/enderecos`);
            return;
        };
        carregarEnderecos();
    },[id]);

    async function carregarEnderecos(){
        setCarregando(true);
        try {
            const response = await api.get<EnderecoDto[]>(`/enderecos/usuario/${id}`);
            setEnderecos(response.data);
        }catch (error){
            setErro('Erro ao carregar endereços.');
        }finally{
            setCarregando(false);
        };
    };


    async function buscarCep(cep: string) {
        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length !== 8)return;

        setBuscandoCep(true);
        try {
            const response = await api.get<ViaCepDto>(`/cep/${cepLimpo}`);
            const dados = response.data;

        if (dados.erro) {
            alert('CEP não encontrado.');
            return;
        }
            
            setForm((prev) => ({
                ...prev,
                logradouro: response.data.logradouro || '',
                bairro: response.data.bairro || '',
                cidade: response.data.cidade || '',
                estado: response.data.estado || '',
            }));
        }catch(error:any){
            if (error.response?.status === 404 || error.response?.status ==400){
                alert("CEP não encontrado")
            }else if (error.response?.status === 401){
                alert("Sessão expirada.")
            }else{
                alert("Erro ao tentar buscar CEP, tente novamente")
            }
        }finally{
            setBuscandoCep(false);
        };
    }
    

        function mudarEvento(evento:React.ChangeEvent<HTMLInputElement>){
            const {name, value, type, checked} = evento.target;
                setForm((prev)=>({...prev,[name]: type === 'checkbox' ? checked : value,
        }));

        if (name === 'cep') {
            buscarCep(value);
        }
    
    }    

        function abrirFormNovo(){
            setEnderecoEditando(null);
            setForm(formVazio);
            setMostrarForm(true);
        };

        function editarForm(endereco: EnderecoDto) {
            setEnderecoEditando(endereco);
            setForm(endereco);
            setMostrarForm(true);
        }

        function fecharForm() {
            setMostrarForm(false);
            setEnderecoEditando(null);
            setForm(formVazio);
        }

        async function tratarEvento(evento: React.FormEvent<HTMLFormElement>){
            evento.preventDefault();
            setSalvando(true);

        try {
            if (enderecoEditando) {
                await api.put(`/enderecos/${enderecoEditando.id}`, form);
            }else{
                await api.post('/enderecos',{...form,usuarioId: Number(id),
                });
            }
            fecharForm();
            carregarEnderecos();
        } catch (error) {
            alert('Não foi possível salvar o endereço.');
        } finally {
            setSalvando(false);
        }
       
    }
    async function definirPadrao(enderecoId:number){
        try {
            await api.patch(`/enderecos/${enderecoId}/padrao?usuarioId=${id}`);
            carregarEnderecos();
        } catch (error) {
            alert('Erro ao definir endereço principal.');
        }
    }

    async function excluir(enderecoId: number){
        if (!confirm('Deseja excluir este endereço?')) return;

        try {
            await api.delete(`/enderecos/${enderecoId}`);
            carregarEnderecos();
        } catch (error) {
            alert('Erro ao excluir endereço.');
        }
    }


    if (carregando) return <p className={styles.mensagem}>Carregando</p>;
    if (erro) return <p className={styles.erro}>{erro}</p>;

    return (
        <>
        <div className={styles.container}>
            <div className={styles.header}>
                <button
                    className={styles.botaoVoltar}
                    onClick={() => navigate(`/usuarios/${id}`)}
                >
                    ← Voltar
                </button>
                <h2 className={styles.titulo}>Endereços</h2>
                <button 
                className={styles.botaoNovo} 
                onClick={abrirFormNovo}>
                    + Novo endereço
                </button>
            </div>

            {enderecos.length === 0 ?(
                <p
                className={styles.mensagem}>
                    Nenhum endereço cadastrado.
                </p>
            ) : (enderecos.map((endereco) =>(<div key={endereco.id} className={styles.card}>
                        <div 
                        className={styles.cardHeader}>
                            <div 
                            className={styles.cardTitulo}>
                                <span 
                                className={styles.rua}>
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
                        </div>

                        <p 
                        className={styles.detalhe}>
                            {endereco.bairro} — {endereco.cidade}/{endereco.estado}
                        </p>

                        <p 
                        className={styles.cep}>
                            CEP: {endereco.cep}
                        </p>

                        <div className={styles.cardAcoes}>
                            {!endereco.enderecoPadrao && (
                                <button
                                    className={styles.botaoPadrao}
                                    onClick={() => definirPadrao(endereco.id!)}
                                >
                                Definir como principal
                                </button>

                            )}

                            <button
                                className={styles.botaoEditar}
                                onClick={() => editarForm(endereco)}
                            >
                                Editar
                            </button>

                            <button
                                className={styles.botaoExcluir}
                                onClick={() => excluir(endereco.id!)}
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                ))
            )}
            {mostrarForm &&
            (<div
                className={styles.overlay}>
                    <div
                    className={styles.modal}>
                        <h3 className={styles.modalTitulo}>
                            {enderecoEditando ? 'Editar endereço' : 'Novo endereço'}
                        </h3>

                        <form onSubmit={tratarEvento} className={styles.form}>
                            <div 
                            className={styles.campo}>
                                <label 
                                className={styles.label}>
                                    CEP
                                </label>

                                <div 
                                className={styles.cepWrapper}>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        name="cep"
                                        placeholder="00000000"
                                        value={form.cep}
                                        onChange={mudarEvento}
                                        maxLength={8}
                                        required
                                    />
                                    {buscandoCep && (<span 
                                                        className={styles.buscandoCep}>
                                                            Buscando
                                                    </span>
                                    )}
                                </div>
                            </div>

                            <div 
                            className={styles.campo}>
                                <label 
                                className={styles.label}>
                                    Logradouro
                                </label>
                                <input
                                    className={styles.inputPreenchido}
                                    type="text"
                                    name="logradouro"
                                    value={form.logradouro || ''}
                                    onChange={mudarEvento}
                                    readOnly
                                />
                            </div>

                            <div className={styles.linha}>
                                <div className={styles.campo}>
                                    <label 
                                    className={styles.label}>
                                        Número
                                    </label>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        name="numero"
                                        placeholder="Ex: 123"
                                        value={form.numero}
                                        onChange={mudarEvento}
                                        required
                                    />
                                </div>

                                <div className={styles.campo}>
                                    <label 
                                    className={styles.label}>
                                        Complemento
                                    </label>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        name="complemento"
                                        placeholder="Ex: Apto 42"
                                        value={form.complemento || ''}
                                        onChange={mudarEvento}
                                    />
                                </div>
                            </div>

                            <div className={styles.campo}>
                                <label 
                                className={styles.label}>
                                    Bairro
                                </label>
                                <input
                                    className={styles.inputPreenchido}
                                    type="text"
                                    name="bairro"
                                    value={form.bairro || ''}
                                    onChange={mudarEvento}
                                    readOnly
                                />
                            </div>

                            <div className={styles.linha}>
                                <div className={styles.campo}>
                                    <label 
                                    className={styles.label}>
                                        Cidade
                                    </label>
                                    <input
                                        className={styles.inputPreenchido}
                                        type="text"
                                        name="cidade"
                                        value={form.cidade || ''}
                                        onChange={mudarEvento}
                                        readOnly
                                    />
                                </div>
                                <div className={styles.campo}>
                                    <label 
                                    className={styles.label}>
                                        Estado
                                    </label>
                                    <input
                                        className={styles.inputPreenchido}
                                        type="text"
                                        name="estado"
                                        value={form.estado || ''}
                                        onChange={mudarEvento}
                                        readOnly
                                    />
                                </div>
                            </div>


                            <div className={styles.checkboxCampo}>
                                <input
                                    type="checkbox"
                                    name="enderecoPadrao"
                                    id="enderecoPadrao"
                                    checked={form.enderecoPadrao || false}
                                    onChange={mudarEvento}
                                />
                                <label 
                                htmlFor="enderecoPadrao"
                                className={styles.checkboxLabel}>
                                    Definir como endereço principal
                                </label>
                            </div>

                            <div className={styles.acoes}>
                                <button
                                    type="button"
                                    className={styles.botaoCancelar}
                                    onClick={fecharForm}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className={styles.botaoSalvar}
                                    disabled={salvando}
                                >
                                    {salvando ? 'Salvando' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
        </>
    );
};