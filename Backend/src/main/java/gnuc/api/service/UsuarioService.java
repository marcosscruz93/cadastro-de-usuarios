package gnuc.api.service;

import gnuc.api.client.ViaCep;
import gnuc.api.dto.EnderecoDto;
import gnuc.api.dto.UsuarioDto;
import gnuc.api.entity.UsuarioEntity;
import gnuc.api.entity.UsuarioRole;
import gnuc.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ViaCep viaCep;

    @Transactional
    public UsuarioDto registrar(UsuarioDto dto) {
        if (usuarioRepository.findByCpf(dto.getCpf()).isPresent()) {
            throw new RuntimeException("Este CPF já está cadastrado.");
        }
        if (dto.getEnderecos() != null && !dto.getEnderecos().isEmpty()) {
            for (EnderecoDto end : dto.getEnderecos()) {
                EnderecoDto dadosViaCep = viaCep.buscaEndereco(end.getCep());
                end.setLogradouro(dadosViaCep.getLogradouro());
                end.setBairro(dadosViaCep.getBairro());
                end.setCidade(dadosViaCep.getCidade());
                end.setEstado(dadosViaCep.getEstado());
                end.setEnderecoPadrao(true);
            }
        }
        UsuarioEntity entity = new UsuarioEntity(dto, passwordEncoder);
        entity.setRole(UsuarioRole.USER);
        return new UsuarioDto(usuarioRepository.save(entity));
    }

    public UsuarioDto salvarEndereco(UsuarioDto dto) {
        if (dto.getEnderecos() != null) {
            for (EnderecoDto enderecoViaCep : dto.getEnderecos()) {
                if (enderecoViaCep.getCep() != null && !enderecoViaCep.getCep().isBlank()) {
                    EnderecoDto dadosViaCep = viaCep.buscaEndereco(enderecoViaCep.getCep());
                    enderecoViaCep.setLogradouro(dadosViaCep.getLogradouro());
                    enderecoViaCep.setBairro(dadosViaCep.getBairro());
                    enderecoViaCep.setCidade(dadosViaCep.getCidade());
                    enderecoViaCep.setEstado(dadosViaCep.getEstado());
                }
            }
        }
        UsuarioEntity usuarioEntity = new UsuarioEntity(dto, passwordEncoder);
        return new UsuarioDto(usuarioRepository.save(usuarioEntity));
    }


    public List<UsuarioDto> listarTodos() {
        List<UsuarioEntity> usuarios = usuarioRepository.findAll();
        return usuarios.stream().map(UsuarioDto::new).toList();
    }

    public UsuarioDto buscarPorId(Long id) {

        UsuarioEntity usuarioAlvo = usuarioRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        String cpfLogado = SecurityContextHolder.getContext().getAuthentication().getName();
        UsuarioEntity usuarioLogado = usuarioRepository.findByCpf(cpfLogado)
                .orElseThrow(() -> new RuntimeException("Usuário logado não encontrado"));

        boolean isAdmin = usuarioLogado.getRole().name().equals("ADMIN");
        boolean isDonoDoDado = usuarioLogado.getId().equals(id);

        if (!isAdmin && !isDonoDoDado) {
            throw new AccessDeniedException("Acesso negado");
        }
        return new UsuarioDto(usuarioAlvo);
    }
    public void excluir(Long id){
        UsuarioEntity usuario = usuarioRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        String cpfLogado = SecurityContextHolder.getContext().getAuthentication().getName();
        UsuarioEntity usuarioLogado = usuarioRepository.findByCpf(cpfLogado)
                .orElseThrow(() -> new RuntimeException("Erro ao identificar usuário logado"));

        boolean isAdmin = usuarioLogado.getRole().name().equals("ADMIN");
        boolean isPropriaConta = usuarioLogado.getId().equals(id);

        if (!isAdmin && !isPropriaConta) {
            throw new AccessDeniedException("Você não tem permissão para excluir esta conta.");
        }

        usuarioRepository.delete(usuario);
    }
}