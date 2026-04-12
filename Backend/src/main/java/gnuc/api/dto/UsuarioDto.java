package gnuc.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import gnuc.api.entity.UsuarioEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.br.CPF;
import org.springframework.beans.BeanUtils;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class UsuarioDto {
    private String role;
    private Long id;

    @NotBlank(message = "Insira seu nome")
    private String nome;

    @CPF(message = "Cpf inválido!")
    @NotBlank(message = "Obrigatório inserir o CPF")
    private String cpf;

    @NotNull(message = "Data de nascimento obrigatória")
    @Past
    private LocalDate dataNascimento;

    @NotBlank(message = "Insira sua senha")

    @Size(min=6, message="A senha deve ter no mínimo 6 caracteres")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private List<EnderecoDto> enderecos;

    public UsuarioDto(UsuarioEntity usuario) {
        BeanUtils.copyProperties(usuario, this);
        this.password = null;
        this.role = usuario.getRole().name();

        if (usuario.getEnderecos() != null) {
            this.enderecos = usuario.getEnderecos().stream()
                    .map(EnderecoDto::new)
                    .collect(Collectors.toList());
        }
    }
}

