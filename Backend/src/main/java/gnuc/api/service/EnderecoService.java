package gnuc.api.service;

import gnuc.api.client.ViaCep;
import gnuc.api.dto.EnderecoDto;
import gnuc.api.entity.EnderecoEntity;
import gnuc.api.entity.UsuarioEntity;
import gnuc.api.repository.EnderecoRepository;
import gnuc.api.repository.UsuarioRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EnderecoService {

    @Autowired
    private EnderecoRepository enderecoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ViaCep viaCep;

    private void validarDonoOuAdmin(Long usuarioIdAlvo) {
        String cpfLogado = SecurityContextHolder.getContext().getAuthentication().getName();

        UsuarioEntity usuarioLogado = usuarioRepository.findByCpf(cpfLogado)
                .orElseThrow(() -> new RuntimeException("Usuário logado não encontrado"));

        boolean isAdmin = usuarioLogado.getRole().name().equals("ADMIN");
        boolean isDono = usuarioLogado.getId().equals(usuarioIdAlvo);

        if (!isAdmin && !isDono) {
            throw new AccessDeniedException("Acesso negado");
        }
    }


    public List<EnderecoDto> listarPorUsuario(Long usuarioId) {
        validarDonoOuAdmin(usuarioId);
        List<EnderecoEntity> enderecos = enderecoRepository.findByUsuarioId(usuarioId);
        return enderecos.stream().map(EnderecoDto::new).toList();
    }

    @Transactional
    public EnderecoDto inserir(EnderecoDto dto) {
        validarDonoOuAdmin(dto.getUsuarioId());

        EnderecoDto dadosApi = viaCep.buscaEndereco(dto.getCep());

        dto.setLogradouro(dadosApi.getLogradouro());
        dto.setBairro(dadosApi.getBairro());
        dto.setCidade(dadosApi.getCidade());
        dto.setEstado(dadosApi.getEstado());

        UsuarioEntity usuario = usuarioRepository.findById(dto.getUsuarioId())
        .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        long total = enderecoRepository.countByUsuarioId(usuario.getId());
        if (total == 0) {dto.setEnderecoPadrao(true);
        }

        if (dto.getEnderecoPadrao() != null && dto.getEnderecoPadrao()) {
            desmarcarEnderecoPadraoAtual(usuario.getId());
        }

        EnderecoEntity entity = new EnderecoEntity();
        BeanUtils.copyProperties(dto, entity, "id", "usuarioId");
        entity.setUsuario(usuario);

        return new EnderecoDto(enderecoRepository.save(entity));
    }

    @Transactional
    public void definirEnderecoPadrao(Long id) {
        EnderecoEntity endereco = enderecoRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));

        validarDonoOuAdmin(endereco.getUsuario().getId());

        desmarcarEnderecoPadraoAtual(endereco.getUsuario().getId());
        endereco.setEnderecoPadrao(true);
        enderecoRepository.save(endereco);
    }

    @Transactional
    public EnderecoDto alterar(Long id, EnderecoDto dto) {
        EnderecoEntity enderecoExistente = enderecoRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));
        validarDonoOuAdmin(enderecoExistente.getUsuario().getId());

        if (dto.getEnderecoPadrao() != null && dto.getEnderecoPadrao()) {
            desmarcarEnderecoPadraoAtual(enderecoExistente.getUsuario().getId());
        }

        BeanUtils.copyProperties(dto, enderecoExistente, "id", "usuario");
        return new EnderecoDto(enderecoRepository.save(enderecoExistente));
    }

    @Transactional
    public void excluir(Long id) {
        EnderecoEntity endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));
        validarDonoOuAdmin(endereco.getUsuario().getId());

        Long usuarioId = endereco.getUsuario().getId();
        boolean enderecoAntigo = endereco.getEnderecoPadrao();

        enderecoRepository.delete(endereco);

        if (enderecoAntigo) {enderecoRepository.findByUsuarioId(usuarioId)
                    .stream()
                    .findFirst()
                    .ifPresent(outro -> {
                        outro.setEnderecoPadrao(true);
                        enderecoRepository.save(outro);
                    });
        }
    }

    private void desmarcarEnderecoPadraoAtual(Long usuarioId) {
        enderecoRepository.findByUsuarioIdAndEnderecoPadraoTrue(usuarioId)
                .ifPresent(enderecoAntigo -> {
                    enderecoAntigo.setEnderecoPadrao(false);
                    enderecoRepository.save(enderecoAntigo);
                }
        );
    }
}
