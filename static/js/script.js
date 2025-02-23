function pauseAnimation() {
    console.log("Pause animation called");
}

function resumeAnimation() {
    console.log("Resume animation called");
}

function submitIdea() {
    console.log("Submit idea called");
}

function loginAdmin() {
    console.log("Login admin called");
}
document.addEventListener("DOMContentLoaded", () => {
    const feedbackBtn = document.getElementById("feedbackButton"); // Берём уже существующую кнопку

    feedbackBtn.addEventListener("click", () => {
        if (feedbackBtn.classList.contains("open")) {
            feedbackBtn.classList.remove("open");
            feedbackBtn.innerHTML = "+"; // Вернуть плюс
        } else {
            feedbackBtn.classList.add("open");
            feedbackBtn.innerHTML = `<span class="feedback-text">manchenko.vd.zelenogorsk@gmail.com</span>`;
        }
    });
});
