document.addEventListener("DOMContentLoaded", () => {
    const feedbackButton = document.getElementById("feedbackButton");
    const feedbackText = document.getElementById("feedbackText");

    feedbackButton.addEventListener("click", () => {
        if (feedbackButton.classList.contains("open")) {
            feedbackButton.classList.remove("open");
            feedbackButton.style.transform = "rotate(0deg)";
            feedbackText.classList.remove("email");
            setTimeout(() => {
                feedbackText.textContent = "Обратная связь";
            }, 300);
        } else {
            feedbackButton.classList.add("open");
            feedbackButton.style.transform = "rotate(45deg)";
            setTimeout(() => {
                feedbackText.textContent = "manchenko.vd.zelenogorsk@gmail.com";
                feedbackText.classList.add("email");
            }, 300);
        }
    });
});
