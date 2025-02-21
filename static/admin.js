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
                case "завершена": color = "#cccccc"; break;
            }
            ideaElement.style.backgroundColor = color;

            ideaElement.innerHTML = `
                <p>${idea.idea}</p>
                <p>${new Date(idea.created_at).toLocaleString()}</p>
                <select onchange="updateStatus(${idea.id}, this.value)">
                    <option value="новая" ${idea.status === "новая" ? "selected" : ""}>Новая</option>
                    <option value="в работе" ${idea.status === "в работе" ? "selected" : ""}>В работе</option>
                    <option value="одобрено" ${idea.status === "одобрено" ? "selected" : ""}>Одобрено</option>
                    <option value="завершена" ${idea.status === "завершена" ? "selected" : ""}>Завершена</option>
                </select>
                <button onclick="deleteIdea(${idea.id})">🗑 Удалить</button>
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
        await fetch(`/ideas/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
            },
            body: JSON.stringify({ status: newStatus })
        });
    } catch (error) {
        console.error("Ошибка обновления статуса:", error);
    }
}
