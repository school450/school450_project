const serverUrl = "https://school450-project-1xdh.onrender.com";

// --- Уведомления ---
function showNotification(message, type) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = type + " show"; // success / error
    notification.style.display = "block";

    // убираем через 2 секунды
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
            notification.style.display = "none";
        }, 500);
    }, 2000);
}

// --- Отправка идеи ---
async function submitIdea() {
    const submitButton = document.getElementById("submitButton");
    const ideaInput = document.getElementById("ideaInput");
    const category = document.getElementById("categorySelect").value;

    // 🚫 обязательный выбор категории
    if (!category || category.trim() === "") {
        showNotification("Выберите категорию!", "error");
        return;
    }

    if (submitButton.disabled) return; // 🚫 защита от двойного клика
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
            document.getElementById("categorySelect").selectedIndex = 0; // сброс категории
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

    if (ideaInput) {
        ideaInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                submitIdea();
            }
        });
    }

    if (submitButton) {
        submitButton.addEventListener("click", submitIdea);
    }
};

// --- Заглушки для анимации ---
function pauseAnimation() {}
function resumeAnimation() {}
