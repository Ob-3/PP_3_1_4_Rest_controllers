document.addEventListener("DOMContentLoaded", function () {
    loadUserInfo();
    setupLogout();
});

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
            document.getElementById('userInfo').textContent = `${user.email} with role: ${roles}`;

            // Заполняем таблицу с данными пользователя
            const userTableBody = document.getElementById('userTableBody');
            userTableBody.innerHTML = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>    
                    <td>${roles}</td>
                </tr>
            `;
        })
        .catch(error => console.error('Ошибка:', error));
}

function setupLogout() {
    document.getElementById('logoutForm').addEventListener('submit', function (event) {
        event.preventDefault();

        fetch('/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }).then(() => {
            window.location.href = '/login';
        }).catch(error => console.error('Ошибка при выходе:', error));
    });
}
