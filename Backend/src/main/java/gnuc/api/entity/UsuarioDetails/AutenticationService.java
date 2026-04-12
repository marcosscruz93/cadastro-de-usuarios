package gnuc.api.entity.UsuarioDetails;

import gnuc.api.repository.UsuarioRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class AutenticationService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    @NonNull
    public UserDetails loadUserByUsername(@NonNull String cpf) throws UsernameNotFoundException{
        return usuarioRepository.findByCpf(cpf)
                .map(UsuarioDetailsImpl::new)
                .orElseThrow((() -> new UsernameNotFoundException("Usuário não encontrado:" + cpf)));
    }
}
