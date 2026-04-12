package gnuc.api.entity.UsuarioDetails.Seguranca;

import gnuc.api.entity.UsuarioDetails.Seguranca.login.LoginRequest;
import gnuc.api.entity.UsuarioDetails.Seguranca.login.LoginResponse;
import gnuc.api.entity.UsuarioDetails.UsuarioDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AutenticationController {

    private final AuthenticationManager authenticationManager;
    private final gnuc.api.entity.UsuarioDetails.Seguranca.JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {

        try {Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                request.getCpf(),
                request.getPassword()
                    )
            );

            UsuarioDetailsImpl userDetails = (UsuarioDetailsImpl) auth.getPrincipal();
            String role = userDetails.getAuthorities()
            .iterator()
            .next()
            .getAuthority();

            String token = jwtUtil.gerarToken(userDetails.getUsername(), role);
            return ResponseEntity.ok(new LoginResponse(
                    token,
                    role,
                    userDetails.getId(),
                    userDetails.getUsuario().getNome()
            ));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).build();
        }
    }
}