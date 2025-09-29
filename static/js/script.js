const serverUrl = "https://school450-project-1xdh.onrender.com";

// --- Уведомления ---
function showNotification(message, type) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = type + " show"; // success / error
    notification.style.display = "block"; // показываем

    // убираем через 2 секунды
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
            notification.style.display = "none"; // полностью скрыть
        }, 500);
    }, 2000);
}

// --- Отправка идеи ---
async function submitIdea() {
    const submitButton = document.getElementById("submitButton");
    const ideaInput = document.getElementById("ideaInput");
    const category = document.getElementById("categorySelect").value;

    if (!category) {
        showNotification("Выберите категорию!", "error");
        submitButton.disabled = false;
        submitButton.textContent = "Отправить";
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Отправка...";

    const idea = ideaInput.value.trim();
    if (!idea || /^[\s\d\p{P}]+$/u.test(idea)) {
        showNotification("Введите осмысленный текст идеи!", "error");
        submitButton.disabled = false;
        submitButton.textContent = "Отправить";
        return;
    }

    try {
        const response = await fetch(`${serverUrl}/ideas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idea, category })
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

// --- Навешиваем события ---
window.onload = () => {
    const ideaInput = document.getElementById("ideaInput");
    const submitButton = document.getElementById("submitButton");

    if (ideaInput && !ideaInput.dataset.bound) {
        ideaInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                submitIdea();
            }
        });
        ideaInput.dataset.bound = true;
    }

    if (submitButton && !submitButton.dataset.bound) {
        submitButton.addEventListener("click", submitIdea);
        submitButton.dataset.bound = true;
    }
};

// --- Заглушки для анимации ---
function pauseAnimation() {
    // пока пусто
}
function resumeAnimation() {
    // пока пусто
}
