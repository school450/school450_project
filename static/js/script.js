const serverUrl = "https://school450-project-1xdh.onrender.com";
let animationPaused = false;

function pauseAnimation() {
    animationPaused = true;
}

function resumeAnimation() {
    animationPaused = false;
}

async function submitIdea() {
    const ideaInput = document.getElementById("ideaInput");
    const submitButton = document.getElementById("submitButton");
    submitButton.disabled = true;
    submitButton.textContent = "Отправка...";

    const idea = ideaInput.value.trim();
    if (!idea || /^[\s\W]+$/.test(idea)) {
        alert("Введите осмысленный текст идеи!");
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
            alert("Идея отправлена!");
            ideaInput.value = "";
        } else {
            alert("Ошибка отправки!");
        }
    } catch (error) {
        alert("Ошибка соединения!");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Отправить";
    }
}
