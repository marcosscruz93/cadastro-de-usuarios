package gnuc.api.controller;

import gnuc.api.client.ViaCep;
import gnuc.api.dto.EnderecoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cep")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ViaCepController {

    private final ViaCep viaCep;

    @GetMapping("/{cep}")
    public ResponseEntity<EnderecoDto> buscarCep(@PathVariable String cep) {
        EnderecoDto endereco = viaCep.buscaEndereco(cep);
        return ResponseEntity.ok(endereco);
    }
}