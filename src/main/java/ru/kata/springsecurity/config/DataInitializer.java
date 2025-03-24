package ru.kata.springsecurity.config;

import ru.kata.springsecurity.entity.Role;
import ru.kata.springsecurity.entity.User;
import ru.kata.springsecurity.repository.RoleRepository;
import ru.kata.springsecurity.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
                Role adminRole = new Role("ROLE_ADMIN");
                roleRepository.save(adminRole);
            }

            if (roleRepository.findByName("ROLE_USER").isEmpty()) {
                Role userRole = new Role("ROLE_USER");
                roleRepository.save(userRole);
            }

            if (userRepository.findByUsername("admin").isEmpty()) {
                Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
                Set<Role> roles = new HashSet<>();
                roles.add(adminRole);

                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("a"));
                admin.setFirstName("Admin");
                admin.setLastName("Adminov");
                admin.setEmail("admin@example.com");
                admin.setAge(30);
                admin.setRoles(roles);
                userRepository.save(admin);
            }

            if (userRepository.findByUsername("user").isEmpty()) {
                Role userRole = roleRepository.findByName("ROLE_USER").orElseThrow();
                Set<Role> roles = new HashSet<>();
                roles.add(userRole);

                User user = new User();
                user.setUsername("user");
                user.setPassword(passwordEncoder.encode("u"));
                user.setFirstName("User");
                user.setLastName("Userov");
                user.setEmail("user@example.com");
                user.setAge(25);
                user.setRoles(roles);
                userRepository.save(user);
            }
        };
    }
}
