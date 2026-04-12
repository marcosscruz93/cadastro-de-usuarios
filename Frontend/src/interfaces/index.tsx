export interface LoginRequest {
    cpf: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    role: string;
    id: number;
    nome: string;
}

export interface AuthState {
    token: string;
    role: string;
    id: number;
    nome: string;
}

export interface EnderecoDto {
    id?: number;
    usuarioId?: number;
    cep: string;
    logradouro?: string;
    numero: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    enderecoPadrao?: boolean;
}

export interface UsuarioDto {
    id?: number;
    nome: string;
    cpf: string;
    dataNascimento: string;
    password?: string;
    role?: string;
    enderecos?: EnderecoDto[];
}
export interface ViaCepDto {
    cep: string;
    logradouro?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    erro?: boolean;
}