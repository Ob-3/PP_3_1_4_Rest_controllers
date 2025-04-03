package ru.kata.springsecurity.restcontrollers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.kata.springsecurity.entity.Role;
import ru.kata.springsecurity.entity.User;
import ru.kata.springsecurity.security.CustomUserDetails;
import ru.kata.springsecurity.service.RoleService;
import ru.kata.springsecurity.service.UserService;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminRestController {

    private final UserService userService;
    private final RoleService roleService;

    public AdminRestController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/current") // Новый метод для получения текущего администратора
    public ResponseEntity<CustomUserDetails> getCurrentAdmin(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(userDetails); // Возвращаем информацию о текущем администраторе
    }

    @GetMapping("/users")
    public List<User> getAllUsers(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return userService.findAll();
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    @GetMapping("/roles")
    public List<Role> getAllRoles() {
        return roleService.findAll();
    }

    @PostMapping("/users")
    public User addUser(@RequestBody User user) {
        List<String> roleIds = user.getRoles().stream()
                .map(role -> String.valueOf(role.getId())) // Преобразуем Long в String
                .toList();
        return userService.createUserWithRoles(user, roleIds);
    }

    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        return userService.updateUserWithRoles(user, user.getRoles().stream().map(Role::getId).toList());
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
    }

}
