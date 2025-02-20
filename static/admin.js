const serverUrl = "https://school450-project-1xdh.onrender.com";

async function fetchIdeas() {
    const response = await fetch(`${serverUrl}/ideas`);
    const ideas = await response.json();
    const list = document.getElementById("ideasList");
    list.innerHTML = "";

    ideas.forEach(idea => {
        const div = document.createElement("div");
        div.className = `idea ${idea.status}`;
        div.innerHTML = `
            <span>${idea.idea} (${new Date(idea.created_at).toLocaleString()})</span>
            <select onchange="updateStatus(${idea.id}, this.value)">
                <option value="pending" ${idea.status === "pending" ? "selected" : ""}>В ожидании</option>
                <option value="approved" ${idea.status === "approved" ? "selected" : ""}>Одобрено</option>
                <option value="rejected" ${idea.status === "rejected" ? "selected" : ""}>Отклонено</option>
            </select>
            <button onclick="deleteIdea(${idea.id})">🗑</button>
        `;
        list.appendChild(div);
    });
}

async function updateStatus(id, status) {
    await fetch(`${serverUrl}/ideas/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    });
    fetchIdeas();
}

async function deleteIdea(id) {
    await fetch(`${serverUrl}/ideas/${id}`, { method: "DELETE" });
    fetchIdeas();
}

function sortByDate() {
    const list = document.getElementById("ideasList");
    Array.from(list.children)
        .sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date))
        .forEach(item => list.appendChild(item));
}

document.addEventListener("DOMContentLoaded", fetchIdeas);
