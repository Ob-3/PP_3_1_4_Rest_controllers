package ru.kata.springsecurity.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import ru.kata.springsecurity.security.CustomUserDetailsService;

@Configuration
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(CustomUserDetailsService customUserDetailsService) {
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.disable())
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/login", "/register", "/user-panel.html", "/admin-panel.html", "/js/**").permitAll()
                        .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN") // API для USER
                        .requestMatchers("/api/admin/**").hasRole("ADMIN") // API для ADMIN
                        .anyRequest().authenticated()
                )

                .formLogin(form -> form
                        .successHandler((request, response, authentication) -> {
                            var roles = authentication.getAuthorities().stream()
                                    .map(grantedAuthority -> grantedAuthority.getAuthority())
                                    .toList();

                            if (roles.contains("ROLE_ADMIN")) {
                                response.sendRedirect("/admin-panel.html"); // Админа отправляем в админку
                            } else {
                                response.sendRedirect("/user-panel.html"); // Обычного юзера в user-panel
                            }
                        })
                        .permitAll()
                )

                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login")
                        .permitAll()
                );

        return http.build();
    }

}
