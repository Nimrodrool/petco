// Questionnaire Flow
const questions = document.querySelectorAll(".question-container");
const nextButtons = document.querySelectorAll("button[id^='next']");
let currentQuestion = 0;

function showNextQuestion() {
    if (currentQuestion < questions.length - 1) {
        questions[currentQuestion].style.display = "none";
        currentQuestion++;
        questions[currentQuestion].style.display = "block";
    } else {
        // After the last question, show the card container
        questions[currentQuestion].style.display = "none";
        document.getElementById("cardContainer").style.display = "flex";
    }
}

// Activate Next button when an answer is selected
nextButtons.forEach((button, index) => {
    const form = button.parentElement;
    form.addEventListener("change", () => {
        if (index === 2) {
            // Allow multiple choices for the third question (checkboxes)
            button.disabled = !Array.from(form.elements).some(input => input.checked);
        } else {
            // For other questions, only allow single choice (radio)
            button.disabled = !Array.from(form.elements).some(input => input.checked && input.type === "radio");
        }
    });
    button.addEventListener("click", showNextQuestion);
});

// Tinder-style Swipe Functionality
const cardContainer = document.getElementById("cardContainer");
let isDragging = false;
let startX, currentX;

function startDrag(event) {
    isDragging = true;
    startX = event.type === "touchstart" ? event.touches[0].clientX : event.clientX;
}

function drag(event) {
    if (!isDragging) return;
    currentX = event.type === "touchmove" ? event.touches[0].clientX : event.clientX;
    const card = event.target.closest(".card");
    const moveX = currentX - startX;
    card.style.transform = `translateX(${moveX}px) rotate(${moveX * 0.1}deg)`;
}

function endDrag(event) {
    if (!isDragging) return;
    isDragging = false;
    const card = event.target.closest(".card");
    const moveX = currentX - startX;
    const swipeThreshold = 100; // Reduced swipe threshold for easier swiping

    if (moveX > swipeThreshold) {
        // Swiped right (like)
        card.classList.add("liked");
        setTimeout(() => {
            card.style.display = "none";
            alert("It's a match!");
        }, 300);
    } else if (moveX < -swipeThreshold) {
        // Swiped left (dislike)
        card.classList.add("disliked");
        setTimeout(() => card.style.display = "none", 300);
    } else {
        // Not enough movement, reset position
        card.style.transform = "";
    }
}

cardContainer.querySelectorAll(".card").forEach(card => {
    card.addEventListener("mousedown", startDrag);
    card.addEventListener("mousemove", drag);
    card.addEventListener("mouseup", endDrag);
    card.addEventListener("mouseleave", endDrag);
    card.addEventListener("touchstart", startDrag);
    card.addEventListener("touchmove", drag);
    card.addEventListener("touchend", endDrag);
});
