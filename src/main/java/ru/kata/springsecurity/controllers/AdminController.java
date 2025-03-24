package ru.kata.springsecurity.controllers;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.kata.springsecurity.entity.User;
import ru.kata.springsecurity.entity.Role;
import ru.kata.springsecurity.security.CustomUserDetails;
import ru.kata.springsecurity.service.RoleService;
import ru.kata.springsecurity.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import java.util.HashSet;
import java.util.Optional;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;

    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping
    public String redirectToUsers() {
        return "redirect:/admin/users";
    }

    @GetMapping("/users")
    public String userList(Model model, @AuthenticationPrincipal CustomUserDetails userDetails) {
        model.addAttribute("users", userService.findAll());
        model.addAttribute("user", new User()); // Добавляем новый User
        model.addAttribute("user", userDetails.getUser()); // Передаем объект User в шаблон
        return "admin-panel";
    }

    @PostMapping("/users/add")
    public String addUser(@ModelAttribute User user, @RequestParam(value = "roles", required = false) List<String> roleId) {
        Set<Role> roles = (roleId != null) ?
                roleId.stream()
                        .map(Long::valueOf) // Преобразование String в Long
                        .map(roleService::findById)
                        .flatMap(Optional::stream)
                        .collect(Collectors.toSet())
                : new HashSet<>();

        user.setRoles(roles);
        userService.save(user);
        return "redirect:/admin/users";
    }

    @PostMapping("/users/update")
    public String updateUser(@ModelAttribute User formUser, @RequestParam(value = "roles", required = false) List<Long> roleId) {
        // Загружаем пользователя из БД по ID
        User user = userService.findById(formUser.getId()).orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        // Обновляем основные поля
        user.setUsername(formUser.getUsername());
        user.setFirstName(formUser.getFirstName());
        user.setLastName(formUser.getLastName());
        user.setAge(formUser.getAge());
        user.setEmail(formUser.getEmail());
        // Если пароль введен, обновляем его
        if (formUser.getPassword() != null && !formUser.getPassword().isEmpty()) {
            user.setPassword(formUser.getPassword()); // Лучше шифровать перед сохранением
        }
        // Обновляем роли
        Set<Role> roles = (roleId != null) ?
                roleId.stream()
                        .map(roleService::findById)
                        .flatMap(Optional::stream)
                        .collect(Collectors.toSet())
                : new HashSet<>();

        user.setRoles(roles);
        // Сохраняем обновленного пользователя
        userService.update(user);
        return "redirect:/admin/users";
    }

    @PostMapping("/users/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return "redirect:/admin/users";
    }
}
