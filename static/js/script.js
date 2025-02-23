console.log("Скрипт загружен!");

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
    const feedbackButton = document.getElementById("feedbackButton");
    const feedbackText = document.getElementById("feedbackText");

    feedbackButton.addEventListener("click", () => {
        if (feedbackButton.classList.contains("open")) {
            feedbackButton.classList.remove("open");
            feedbackButton.style.transform = "rotate(0deg)";
            feedbackText.style.opacity = "1"; 
            feedbackText.textContent = "Обратная связь";
        } else {
            feedbackButton.classList.add("open");
            feedbackButton.style.transform = "rotate(45deg)";
            feedbackText.style.opacity = "1"; 
            feedbackText.textContent = "manchenko.vd.zelenogorsk@gmail.com";
        }
    });
});
