package gnuc.api.dto;


import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import gnuc.api.entity.EnderecoEntity;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.BeanUtils;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class EnderecoDto {
    private Long id;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Long usuarioId;

    @NotBlank(message = "CEP é obrigatório")
    private String cep;

    private String logradouro;

    @NotBlank(message = "Obrigatório inserir seu número")
    private String numero;

    private String complemento;

    private String bairro;

    @JsonAlias("localidade")
    private String cidade;

    @JsonAlias("uf")
    private String estado;

    private Boolean enderecoPadrao;

    public EnderecoDto(EnderecoEntity endereco) {
    BeanUtils.copyProperties(endereco, this);
    if (endereco.getUsuario() != null) {
        this.usuarioId = endereco.getUsuario().getId();
    }
  }
}