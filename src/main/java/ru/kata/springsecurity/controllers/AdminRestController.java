package ru.kata.springsecurity.controllers;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
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

    @GetMapping("/users")
    public List<User> getAllUsers(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return userService.findAll();
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    @PostMapping("/users")
    public User addUser(@RequestBody User user, @RequestParam(value = "roles", required = false) List<String> roleIds) {
        return userService.createUserWithRoles(user, roleIds);
    }

    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user, @RequestParam(value = "roles", required = false) List<Long> roleIds) {
        user.setId(id);
        return userService.updateUserWithRoles(user, roleIds);
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
    }
}
