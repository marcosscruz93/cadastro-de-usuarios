package gnuc.api.repository;

import gnuc.api.entity.EnderecoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnderecoRepository extends JpaRepository <EnderecoEntity, Long> {
    List<EnderecoEntity> findByUsuarioId(Long usuarioId);
    Optional<EnderecoEntity> findByUsuarioIdAndEnderecoPadraoTrue(Long usuarioId);
    long countByUsuarioId(Long usuarioId);
}
