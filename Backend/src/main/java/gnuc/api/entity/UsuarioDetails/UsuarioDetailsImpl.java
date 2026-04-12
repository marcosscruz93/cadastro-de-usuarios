package gnuc.api.entity.UsuarioDetails;

import gnuc.api.entity.UsuarioEntity;
import lombok.NonNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UsuarioDetailsImpl implements UserDetails {

    private final UsuarioEntity usuario;
    public UsuarioDetailsImpl(UsuarioEntity usuario){
    this.usuario = usuario;
    }

    @Override
    @NonNull
    public Collection<? extends GrantedAuthority> getAuthorities(){
        return List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRole().name()));
    }

    public UsuarioEntity getUsuario() {
        return this.usuario;
    }

    @NonNull
    @Override
    public String getPassword(){
        return usuario.getPassword();
    }

    @NonNull
    @Override
    public String getUsername(){
    return usuario.getCpf();
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }

    public Long getId() {
    return usuario.getId();
    }
}
