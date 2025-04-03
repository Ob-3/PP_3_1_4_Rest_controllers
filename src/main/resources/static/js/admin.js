document.addEventListener("DOMContentLoaded", function () {
    loadUsers();
    loadRoles();
    setupAddUserForm();
    setupLogout();
    loadCurrentUser();
});

function loadCurrentUser() {
    fetch("/api/admin/current")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Берем данные из вложенного объекта "user"
            const user = data.user;
            if (user) {
                const userInfo = document.getElementById("userInfo");
                if (userInfo) {
                    userInfo.textContent = `${user.email} with role:  ${user.roles.map(role => role.name.replace("ROLE_", "")).join(", ")}`;
                }
            } else {
                console.error("Ошибка: данные пользователя не найдены в ответе API.");
            }
        })
        .catch(error => console.error("Ошибка при загрузке текущего пользователя:", error));
}

function loadUsers() {
    fetch('/api/admin/users')
        .then(response => response.json())
        .then(users => {
            const usersTableBody = document.getElementById("usersTableBody");
            usersTableBody.innerHTML = "";

            users.forEach(user => {
                const row = document.createElement("tr");
                row.dataset.id = user.id;
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(role => role.name.replace("ROLE_", "")).join(", ")}</td>
                    <td><button class="btn btn-info editBtn" data-id="${user.id}">Edit</button></td>
                    <td><button class="btn btn-danger deleteBtn" data-id="${user.id}">Delete</button></td>
                `;
                usersTableBody.appendChild(row);
            });

            document.querySelectorAll(".editBtn").forEach(button => {
                button.addEventListener("click", openEditModal);
            });

            document.querySelectorAll(".deleteBtn").forEach(button => {
                button.addEventListener("click", deleteUser);
            });
        })
        .catch(error => console.error("Ошибка при загрузке пользователей:", error));
}

function loadRoles() {
    fetch("/api/admin/roles")
        .then(response => response.json())
        .then(roles => {

            const newRolesSelect = document.getElementById("newRoles");
            newRolesSelect.innerHTML = "";
            roles.forEach(role => {
                const option = document.createElement("option");
                option.value = role.id;
                option.textContent = role.name.replace("ROLE_", "");
                newRolesSelect.appendChild(option);
            });

            const editRolesSelect = document.getElementById("editRoles");
            editRolesSelect.innerHTML = "";
            roles.forEach(role => {
                const option = document.createElement("option");
                option.value = role.id;
                option.textContent = role.name.replace("ROLE_", "");
                editRolesSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Ошибка загрузки ролей:", error));
}

function setupAddUserForm() {
    const addUserForm = document.getElementById("addUserForm");

    addUserForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Предотвращаем стандартную отправку формы

        const newUser = {
            firstName: document.getElementById("newFirstName").value,
            lastName: document.getElementById("newLastName").value,
            age: parseInt(document.getElementById("newAge").value), // Возраст как число
            email: document.getElementById("newEmail").value,
            username: document.getElementById("newUsername").value,
            password: document.getElementById("newPassword").value,
            roles: Array.from(document.getElementById("newRoles").selectedOptions).map(option => ({
                id: parseInt(option.value) // Преобразуем в число
            }))
        };

        console.log("Отправка данных пользователя:", newUser); // Логируем для отладки

        fetch("/api/admin/users", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newUser)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {

                window.location.reload(); // Обновление страницы
            })
            .catch(error => console.error("Ошибка при добавлении пользователя:", error));
    });
}


function openEditModal(event) {
    const userId = event.target.dataset.id;

    fetch(`/api/admin/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById("editUserId").value = user.id;
            document.getElementById("editUserIdDisplay").value = user.id;
            document.getElementById("editFirstName").value = user.firstName;
            document.getElementById("editLastName").value = user.lastName;
            document.getElementById("editAge").value = user.age;
            document.getElementById("editEmail").value = user.email;

            // Загружаем роли
            const editRolesSelect = document.getElementById("editRoles");
            editRolesSelect.innerHTML = "";

            fetch("/api/admin/roles")
                .then(response => response.json())
                .then(roles => {
                    roles.forEach(role => {
                        const option = document.createElement("option");
                        option.value = role.id;
                        option.textContent = role.name.replace("ROLE_", "");

                        // Если у пользователя есть эта роль, делаем ее выбранной
                        if (user.roles.some(userRole => userRole.id === role.id)) {
                            option.selected = true;
                        }

                        editRolesSelect.appendChild(option);
                    });
                });

            // Открываем модальное окно
            new bootstrap.Modal(document.getElementById("editUserModal")).show();
        })
        .catch(error => console.error("Ошибка при загрузке пользователя:", error));
}


document.getElementById("saveEdit").addEventListener("click", function () {
    const userId = document.getElementById("editUserId").value;

    const updatedUser = {
        firstName: document.getElementById("editFirstName").value,
        lastName: document.getElementById("editLastName").value,
        age: document.getElementById("editAge").value,
        email: document.getElementById("editEmail").value,
        roles: Array.from(document.getElementById("editRoles").selectedOptions).map(option => ({
            id: parseInt(option.value)
        }))
    };

    fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(updatedUser)
    })
        .then(() => {
            loadUsers(); // Обновляем таблицу пользователей
            bootstrap.Modal.getInstance(document.getElementById("editUserModal")).hide();
        })
        .catch(error => console.error("Ошибка при обновлении пользователя:", error));
});


function deleteUser(event) {
    const userId = event.target.dataset.id;

    // Получаем данные пользователя перед удалением
    fetch(`/api/admin/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById("deleteUserId").value = user.id;
            document.getElementById("deleteFirstName").value = user.firstName;
            document.getElementById("deleteLastName").value = user.lastName;

            document.getElementById("deleteAge").value = user.age;

            document.getElementById("deleteEmail").value = user.email;
            document.getElementById("deleteRoles").value = user.roles.map(r => r.name.replace("ROLE_", "")).join(", ");

            // Открываем модальное окно удаления
            new bootstrap.Modal(document.getElementById("deleteUserModal")).show();
        })
        .catch(error => console.error("Ошибка при загрузке пользователя:", error));
}

// Обработка кнопки "Confirm Delete"
document.getElementById("confirmDelete").addEventListener("click", function () {
    const userId = document.getElementById("deleteUserId").value;

    fetch(`/api/admin/users/${userId}`, {method: "DELETE"})
        .then(() => {
            loadUsers();  // Обновляем список пользователей
            bootstrap.Modal.getInstance(document.getElementById("deleteUserModal")).hide();
        })
        .catch(error => console.error("Ошибка при удалении пользователя:", error));
});

function setupLogout() {
    document.getElementById("logoutBtn").addEventListener("click", function () {
        fetch("/logout", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        })
            .then(() => {
                window.location.href = "/login";
            })
            .catch(error => console.error("Ошибка при выходе:", error));
    });

}
