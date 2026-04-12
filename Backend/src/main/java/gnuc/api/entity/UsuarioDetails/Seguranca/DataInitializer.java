package gnuc.api.entity.UsuarioDetails.Seguranca;

import gnuc.api.entity.UsuarioEntity;
import gnuc.api.entity.UsuarioRole;
import gnuc.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String cpfAdmin = "11144477735";

        if (usuarioRepository.findByCpf(cpfAdmin).isEmpty()) {
            UsuarioEntity admin = new UsuarioEntity();
            admin.setNome("Administrador");
            admin.setCpf(cpfAdmin);
            admin.setDataNascimento(LocalDate.of(1990, 1, 1));
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(UsuarioRole.ADMIN);

            usuarioRepository.save(admin);
            System.out.println("Admin criado com sucesso!");
            System.out.println("CPF: " + cpfAdmin);
            System.out.println("Senha: admin123");
        } else {
            System.out.println("Admin já existe no banco.");
        }
    }
}