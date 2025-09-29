let allIdeas = []; // храним все идеи

document.addEventListener("DOMContentLoaded", () => {
    fetchIdeas();

    // обработчики фильтров
    const categoryFilter = document.getElementById("categoryFilter");
    const sortBy = document.getElementById("sortBy");

    if (categoryFilter) {
        categoryFilter.addEventListener("change", renderIdeas);
    }
    if (sortBy) {
        sortBy.addEventListener("change", renderIdeas);
    }
});

async function fetchIdeas() {
    try {
        const response = await fetch("/ideas");
        const ideas = await response.json();
        allIdeas = ideas; // сохранили
        renderIdeas(); // нарисовали
    } catch (error) {
        console.error("Ошибка загрузки идей:", error);
    }
}

function renderIdeas() {
    const ideasList = document.getElementById("ideasList");
    const categoryFilter = document.getElementById("categoryFilter")?.value || "all";
    const sortBy = document.getElementById("sortBy")?.value || "date";

    let filtered = [...allIdeas];

    // фильтр по категории
    if (categoryFilter !== "all") {
        filtered = filtered.filter(idea => idea.category === categoryFilter);
    }

    // сортировка
    if (sortBy === "date") {
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "count") {
        filtered.sort((a, b) => (b.count || 1) - (a.count || 1));
    } else if (sortBy === "category") {
        filtered.sort((a, b) => a.category.localeCompare(b.category));
    }

    // отрисовка
    ideasList.innerHTML = "";

    if (filtered.length === 0) {
        ideasList.innerHTML = "<p>Нет заявок</p>";
        return;
    }

    filtered.forEach(idea => {
        const ideaElement = document.createElement("div");
        ideaElement.classList.add("idea-card");

        let color;
        switch (idea.status) {
            case "новая": color = "#b3d9ff"; break;
            case "в работе": color = "#ffcc66"; break;
            case "одобрено": color = "#99ff99"; break;
            case "отклонено": color = "#ff9999"; break;
        }
        ideaElement.style.backgroundColor = color;

        ideaElement.innerHTML = `
            <div class="idea-content">
                <p class="idea-text">${idea.idea} ${idea.count > 1 ? `(×${idea.count})` : ""}</p>
                <p class="idea-date">
                    Категория: ${idea.category} <br>
                    ${new Date(idea.created_at).toLocaleString()}
                </p>
            </div>
            <select class="select-status" onchange="updateStatus(${idea.id}, this.value)">
                <option value="новая" ${idea.status === "новая" ? "selected" : ""}>Новая</option>
                <option value="в работе" ${idea.status === "в работе" ? "selected" : ""}>В работе</option>
                <option value="одобрено" ${idea.status === "одобрено" ? "selected" : ""}>Одобрено</option>
                <option value="отклонено" ${idea.status === "отклонено" ? "selected" : ""}>Отклонено</option>
            </select>
            <button onclick="deleteIdea(${idea.id})">🗑 Удалить</button>
        `;

        ideasList.appendChild(ideaElement);
    });
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
        await fetch(`/ideas/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        fetchIdeas();
    } catch (error) {
        console.error("Ошибка обновления статуса:", error);
    }
}

async function loginAdmin() {
    const code = document.getElementById('adminCode').value;
    try {
        const response = await fetch("/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
        });
        const result = await response.json();
        if (response.ok) {
            localStorage.setItem("adminToken", result.token);
            document.getElementById('adminSection').style.display = 'block';
            fetchIdeas();
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error("Ошибка входа:", error);
    }
}