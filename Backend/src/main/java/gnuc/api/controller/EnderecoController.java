package gnuc.api.controller;

import gnuc.api.dto.EnderecoDto;
import gnuc.api.service.EnderecoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value="/enderecos")
@CrossOrigin(origins = "http://localhost:3000")

public class EnderecoController {

    @Autowired
    private EnderecoService enderecoService;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<EnderecoDto>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(enderecoService.listarPorUsuario(usuarioId));
    }

    @PostMapping
    public ResponseEntity<EnderecoDto> inserir(@Valid @RequestBody EnderecoDto dto) {
        EnderecoDto criado = enderecoService.inserir(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnderecoDto> alterar(@PathVariable Long id,@Valid @RequestBody EnderecoDto dto) {
        return ResponseEntity.ok(enderecoService.alterar(id, dto));
    }

    @PatchMapping("/{id}/padrao")
    public ResponseEntity<Void> definirPadrao(@PathVariable Long id) {
        enderecoService.definirEnderecoPadrao(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        enderecoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}

