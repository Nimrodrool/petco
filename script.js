document.addEventListener("DOMContentLoaded", () => {
    const questions = [
        { form: "form1", next: "next1", container: "question1" },
        { form: "form2", next: "next2", container: "question2" },
        { form: "form3", next: "next3", container: "question3" },
        { form: "form4", next: "next4", container: "question4" }
    ];

    questions.forEach((q, i) => {
        const form = document.getElementById(q.form);
        const next = document.getElementById(q.next);
        const currentContainer = document.getElementById(q.container);
        const nextContainer = questions[i + 1] ? document.getElementById(questions[i + 1].container) : null;

        form.addEventListener("change", () => {
            next.disabled = false;
        });

        next.addEventListener("click", () => {
            currentContainer.style.display = "none";
            if (nextContainer) {
                nextContainer.style.display = "block";
            } else {
                document.getElementById("cardContainer").style.display = "block";
                initSwipe();
            }
        });
    });

    function initSwipe() {
        const cards = Array.from(document.querySelectorAll(".card"));
        let currentCardIndex = 0;

        cards.forEach((card, index) => {
            card.style.zIndex = cards.length - index;
            card.addEventListener("pointerdown", startDrag);
        });

        function startDrag(event) {
            const card = event.target.closest(".card");
            let startX = event.clientX;
            let isDragging = false;

            function onPointerMove(event) {
                isDragging = true;
                const dx = event.clientX - startX;
                card.style.transform = `translateX(${dx}px) rotate(${dx * 0.1}deg)`;
            }

            function onPointerUp(event) {
                if (!isDragging) return;
                document.removeEventListener("pointermove", onPointerMove);
                document.removeEventListener("pointerup", onPointerUp);

                const dx = event.clientX - startX;
                if (Math.abs(dx) > 100) {
                    const direction = dx > 0 ? "right" : "left";
                    card.style.transition = "transform 0.3s";
                    card.style.transform = `translateX(${direction === "right" ? 300 : -300}px) rotate(${direction === "right" ? 20 : -20}deg)`;
                    setTimeout(() => {
                        card.style.display = "none";
                        showNextCard();
                    }, 300);
                } else {
                    card.style.transition = "transform 0.3s";
                    card.style.transform = "translateX(0) rotate(0)";
                }
                isDragging = false;
            }

            document.addEventListener("pointermove", onPointerMove);
            document.addEventListener("pointerup", onPointerUp);
        }

        function showNextCard() {
            currentCardIndex++;
            if (currentCardIndex < cards.length) {
                cards[currentCardIndex].style.zIndex = cards.length - currentCardIndex;
            } else {
                alert("Thank you for your choices!");
            }
        }
    }
});
