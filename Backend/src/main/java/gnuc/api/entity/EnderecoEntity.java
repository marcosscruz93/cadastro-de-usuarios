package gnuc.api.entity;

import jakarta.persistence.*;
import lombok.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="enderecos")

public class EnderecoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioEntity usuario;

    @Column(name = "cep", nullable = false, length = 10)
    private String cep;

    @Column(name="logradouro", nullable = false)
    private String logradouro;

    @Column(name = "numero", nullable = false)
    private String numero;

    @Column(name = "complemento")
    private String complemento;

    @Column(name = "bairro", nullable = false)
    private String bairro;

    @Column(name = "cidade", nullable = false)
    private String cidade;

    @Column(name = "estado", nullable = false)
    private String estado;

    @Column(name = "endereco_padrao", nullable = false)
    private Boolean enderecoPadrao = false;

    @Override
    public boolean equals(Object objetoComparado) {
        if (objetoComparado == null || getClass() != objetoComparado.getClass()) return false;
        EnderecoEntity endereco = (EnderecoEntity) objetoComparado;
        return Objects.equals(id, endereco.id);
    }
    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
