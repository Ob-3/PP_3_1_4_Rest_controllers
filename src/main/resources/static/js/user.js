$(document).ready(function () {
    loadCsrfToken();  // Загружаем CSRF-токен
    loadUserInfo();   // Загружаем пользователя

    function loadCsrfToken() {
        fetch('/csrf-token')
            .then(response => response.json())
            .then(data => {
                $('#csrf_token').val(data.token);
            })
            .catch(error => console.error('Ошибка при получении CSRF-токена:', error));
    }

    function loadUserInfo() {
        fetch('/api/user/home')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке информации о пользователе');
                }
                return response.json();
            })
            .then(user => {
                const roles = user.roles.map(role => role.name.replace('ROLE_', '')).join(', ');
                $('#userInfo').text(`${user.email} with roles: ${roles}`);

                $('#userTableBody').html(`
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td>${roles}</td>
                    </tr>
                `);
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
    }

    $('#logoutForm').on('submit', function (event) {
        event.preventDefault();
        fetch('/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `csrf_token=${$('#csrf_token').val()}`
        }).then(() => {
            window.location.href = '/login';
        }).catch(error => {
            console.error('Ошибка при выходе:', error);
        });
    });
});
