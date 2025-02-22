document.addEventListener("DOMContentLoaded", () => {
    fetchIdeas();
});

async function fetchIdeas() {
    try {
        const response = await fetch("/ideas");
        const ideas = await response.json();
        const ideasList = document.getElementById("ideasList");
        ideasList.innerHTML = "";

        if (ideas.length === 0) {
            ideasList.innerHTML = "<p>Нет заявок</p>";
            return;
        }

        ideas.forEach(idea => {
            const ideaElement = document.createElement("div");
            ideaElement.classList.add("idea-card");

            let color;
            switch (idea.status) {
                case "новая": color = "#b3d9ff"; break;
                case "в работе": color = "#ffcc66"; break;
                case "одобрено": color = "#99ff99"; break;
                case "отклонено": color = "#fa0202"; break;
            }
            ideaElement.style.backgroundColor = color;

            ideaElement.innerHTML = `
    <div>
        <p><strong>Идея:</strong> ${idea.idea}</p>
        <p style="font-size: 12px; color: gray;"><strong>Дата:</strong> ${new Date(idea.created_at).toLocaleString()}</p>
    </div>
    <div>
        <select onchange="updateStatus(${idea.id}, this.value)">
            <option value="новая" ${idea.status === "новая" ? "selected" : ""}>Новая</option>
            <option value="в работе" ${idea.status === "в работе" ? "selected" : ""}>В работе</option>
            <option value="одобрено" ${idea.status === "одобрено" ? "selected" : ""}>Одобрено</option>
            <option value="завершена" ${idea.status === "завершена" ? "selected" : ""}>Завершена</option>
        </select>
        <button onclick="deleteIdea(${idea.id})">🗑 Удалить</button>
    </div>
`;


            ideasList.appendChild(ideaElement);
        });
    } catch (error) {
        console.error("Ошибка загрузки идей:", error);
    }
}

async function deleteIdea(id) {
    if (!confirm("Вы уверены, что хотите удалить эту заявку?")) return;

    try {
        const response = await fetch(`/ideas/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }
        });

        if (response.ok) {
            fetchIdeas();
        }
    } catch (error) {
        console.error("Ошибка удаления:", error);
    }
}

async function updateStatus(id, newStatus) {
    try {
        const response = await fetch(`/ideas/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            fetchIdeas(); // Теперь список обновляется после изменения статуса
        }
    } catch (error) {
        console.error("Ошибка обновления статуса:", error);
    }
}

const serverUrl = window.location.origin;

async function loginAdmin() {
    const code = document.getElementById('adminCode').value;
    try {
        const response = await fetch(`${serverUrl}/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem("adminToken", result.token);
            document.getElementById('adminSection').style.display = 'block';
            fetchIdeas(); // <-- Исправлено: должно быть fetchIdeas(), а не loadIdeas()
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error("Ошибка авторизации:", error);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    fetchIdeas();

    // Поддержка Enter для входа в админку
    document.getElementById("adminCode").addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            loginAdmin();
        }
    });

    // Поддержка Enter для отправки новой идеи (если есть поле ввода)
    const ideaInput = document.getElementById("ideaInput");
    if (ideaInput) {
        ideaInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                submitIdea();
            }
        });
    }
});
