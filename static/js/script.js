const serverUrl = "https://school450-project-1xdh.onrender.com";

// --- Уведомления ---
function showNotification(message, type) {
    let notification = document.getElementById("notification");

    // если блока нет в html → создаём
    if (!notification) {
        notification = document.createElement("div");
        notification.id = "notification";
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.className = type; // success / error
    notification.style.display = "block";
    notification.style.opacity = "1";

    // скрыть через 3 секунды
    setTimeout(() => {
        notification.style.opacity = "0";
        setTimeout(() => {
            notification.style.display = "none";
        }, 600);
    }, 3000);
}

// --- Отправка идеи ---
async function submitIdea() {
    const ideaInput = document.getElementById("ideaInput");
    const submitButton = document.getElementById("submitButton");
    submitButton.disabled = true;
    submitButton.textContent = "Отправка...";

    const idea = ideaInput.value.trim();
    if (!idea || /^[\s\W]+$/.test(idea)) {
        showNotification("Введите осмысленный текст идеи!", "error");
        submitButton.disabled = false;
        submitButton.textContent = "Отправить";
        return;
    }

    try {
        const response = await fetch(`${serverUrl}/ideas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idea })
        });

        if (response.ok) {
            showNotification("Идея отправлена!", "success");
            ideaInput.value = "";
        } else {
            showNotification("Ошибка отправки!", "error");
        }
    } catch (error) {
        showNotification("Ошибка соединения!", "error");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Отправить";
    }
}

// --- События при загрузке ---
document.addEventListener("DOMContentLoaded", () => {
    const ideaInput = document.getElementById("ideaInput");
    const submitButton = document.getElementById("submitButton");

    // Enter = отправка
    if (ideaInput) {
        ideaInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                submitIdea();
            }
        });
    }

    // Клик по кнопке
    if (submitButton) {
        submitButton.addEventListener("click", submitIdea);
    }
});
