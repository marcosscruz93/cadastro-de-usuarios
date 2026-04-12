package gnuc.api.entity;

import java.util.List;
import gnuc.api.dto.UsuarioDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Objects;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuarios",
        uniqueConstraints = @UniqueConstraint(name = "uk_usuarios_cpf", columnNames = "cpf"))

public class UsuarioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UsuarioRole role = UsuarioRole.USER;

    @Column(name = "nome_completo", nullable = false)
    private String nome;

    @Column(name = "cpf", unique = true, nullable = false)
    private String cpf;

    @Column(name = "data_de_nascimento", nullable = false)
    private LocalDate dataNascimento;

    @Column(name = "password_hash", nullable = false)
    private String password;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EnderecoEntity> enderecos = new ArrayList<>();

    public UsuarioEntity(UsuarioDto dto, PasswordEncoder encoder) {
        BeanUtils.copyProperties(dto, this, "password");
        this.password = encoder.encode(dto.getPassword());
        this.role = UsuarioRole.USER;

        if (dto.getEnderecos() != null && !dto.getEnderecos().isEmpty()) {
            this.enderecos = dto.getEnderecos().stream()
                    .map(enderecoDto -> {EnderecoEntity enderecoEntity = new EnderecoEntity();
                        BeanUtils.copyProperties(enderecoDto, enderecoEntity);
                        if (enderecoEntity.getEnderecoPadrao() == null) {enderecoEntity.setEnderecoPadrao(false);
                        }
                        enderecoEntity.setUsuario(this);
                        return enderecoEntity;
                    })
                    .collect(Collectors.toList());}
        }

    @Override
    public boolean equals(Object objetoComparado) {
        if (objetoComparado == null || getClass() != objetoComparado.getClass()) return false;
        UsuarioEntity usuario = (UsuarioEntity) objetoComparado;
        return Objects.equals(id, usuario.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}