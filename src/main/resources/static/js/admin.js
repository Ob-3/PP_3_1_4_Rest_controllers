$(document).ready(function () {
    // Сначала рендерим динамические элементы
    loadAddUserForm();
    loadEditUserModal();

    loadUsers(); // Загрузка пользователей
    loadRoles(); // Загрузка ролей для формы

    // Загружаем список пользователей в таблицу
    function loadUsers() {
        fetch('/api/admin/users')
            .then(response => response.json())
            .then(users => {
                let rows = '';
                users.forEach(user => {
                    rows += `
                        <tr data-id="${user.id}">
                            <td>${user.id}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>
                            <td>${user.email}</td>
                            <td>${user.roles.map(r => r.name.replace('ROLE_', '')).join(', ')}</td>
                            <td><button class="btn btn-info editBtn" data-id="${user.id}">Edit</button></td>
                            <td><button class="btn btn-danger deleteBtn" data-id="${user.id}">Delete</button></td>
                        </tr>`;
                });
                $('#usersTableBody').html(rows);
            })
            .catch(error => console.error('Ошибка при загрузке пользователей:', error));
    }

    // Динамически создаем форму добавления пользователя
    function loadAddUserForm() {
        $('#addUserFormContainer').html(`
            <form id="addUserForm">
                <input type="text" id="newFirstName" placeholder="First Name" required>
                <input type="text" id="newLastName" placeholder="Last Name" required>
                <input type="number" id="newAge" placeholder="Age" required>
                <input type="email" id="newEmail" placeholder="Email" required>
                <input type="text" id="newUsername" placeholder="Username" required>
                <input type="password" id="newPassword" placeholder="Password" required>
                <select id="newRoles" multiple></select>  
                <button type="submit">Add User</button>
            </form>
        `);

        $('#addUserForm').on('submit', function (event) {
            event.preventDefault();
            addUser();
        });

        // Загружаем роли
        fetch("/api/admin/roles")
            .then(response => response.json())
            .then(roles => {
                let options = '';
                roles.forEach(role => {
                    options += `<option value="${role.id}">${role.name.replace('ROLE_', '')}</option>`;
                });
                $('#newRoles').html(options);
            });
    }

    // Динамически создаем модальное окно редактирования
    function loadEditUserModal() {
        $('#editUserModalContainer').html(`
            <div id="editUserModal" class="modal fade">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit User</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <input type="hidden" id="editUserId">
                            <input type="text" id="editFirstName" required>
                            <input type="text" id="editLastName" required>
                            <input type="number" id="editAge" required>
                            <input type="email" id="editEmail" required>
                            <input type="password" id="editPassword">
                            <select id="editRoles" multiple></select>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button id="saveEdit" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    // Открытие модального окна редактирования
    $(document).on('click', '.editBtn', function () {
        let userId = $(this).data('id');
        fetch(`/api/admin/users/${userId}`)
            .then(response => response.json())
            .then(user => {
                $('#editUserId').val(user.id);
                $('#editFirstName').val(user.firstName);
                $('#editLastName').val(user.lastName);
                $('#editAge').val(user.age);
                $('#editEmail').val(user.email);
                $('#editRoles').val(user.roles.map(role => role.id));
                $('#editUserModal').modal('show');
            })
            .catch(error => console.error('Ошибка при загрузке данных пользователя:', error));
    });

    // Сохранение изменений в редактируемом пользователе
    $('#saveEdit').on('click', function () {
        let userId = $('#editUserId').val();
        let updatedUser = {
            firstName: $('#editFirstName').val(),
            lastName: $('#editLastName').val(),
            age: $('#editAge').val(),
            email: $('#editEmail').val(),
            roles: $('#editRoles').val()
        };
        fetch(`/api/admin/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser)
        })
            .then(() => {
                loadUsers();
                $('#editUserModal').modal('hide');
            })
            .catch(error => console.error('Ошибка при обновлении пользователя:', error));
    });

    // Удаление пользователя
    $(document).on('click', '.deleteBtn', function () {
        let userId = $(this).data('id');
        if (confirm('Are you sure you want to delete this user?')) {
            fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
                .then(() => loadUsers());
        }
    });
});
