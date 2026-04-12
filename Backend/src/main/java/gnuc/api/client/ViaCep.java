package gnuc.api.client;

import gnuc.api.dto.EnderecoDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "viacep", url = "https://viacep.com.br/ws")
public interface ViaCep {

    @GetMapping("/{cep}/json/")
    EnderecoDto buscaEndereco(@PathVariable("cep") String cep);
}
