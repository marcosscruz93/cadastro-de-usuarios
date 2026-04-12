package gnuc.api.controller;

import gnuc.api.dto.UsuarioDto;
import gnuc.api.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value="/usuarios")
@CrossOrigin(origins = "http://localhost:3000")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<UsuarioDto> listarTodos(){
        return usuarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDto> buscarPorId(@PathVariable Long id) {
    return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<UsuarioDto> inserir(@Valid @RequestBody UsuarioDto usuario) {
        UsuarioDto usuarioDto = usuarioService.salvarEndereco(usuario);
        return ResponseEntity.ok(usuarioDto);
    }

    @PostMapping("/registrar")
    public ResponseEntity<UsuarioDto> registrar(@RequestBody @Valid UsuarioDto dto) {
        return ResponseEntity.status(201).body(usuarioService.registrar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDto> alterar(@PathVariable Long id, @Valid @RequestBody UsuarioDto usuario) {
        UsuarioDto usuarioDto = usuarioService.salvarEndereco(usuario);
        return ResponseEntity.ok(usuarioDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>excluir(@PathVariable("id") Long id){
        usuarioService.excluir(id);
        return ResponseEntity.ok().build();
    }
}
