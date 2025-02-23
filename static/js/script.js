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
            feedbackText.style.transform = "translateY(0px)";
            setTimeout(() => {
                feedbackText.innerHTML = "Обратная связь";
            }, 300);
        } else {
            feedbackButton.classList.add("open");
            feedbackButton.style.transform = "rotate(45deg)";
            feedbackText.style.transform = "translateY(20px)";
            setTimeout(() => {
                feedbackText.innerHTML = "manchenko.vd.zelenogorsk@gmail.com";
            }, 300);
        }
    });
});
