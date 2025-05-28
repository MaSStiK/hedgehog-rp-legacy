import confetti from "canvas-confetti";
import { getRandomInt} from "./Global"

export default function Confetti(showEffect) {
    let canvas = document.getElementById("theme-canvas");
    if (canvas) canvas.remove() // Удаляем канвас что бы эффект не наслаивался
    if (!showEffect) return // Не создаем канвас если не нужно отображать эффект
    
    // Создаём новый canvas-элемент
    canvas = document.createElement("canvas");
    canvas.id = "theme-canvas";

    // Добавляем его в root
    const rootDiv = document.getElementById("root");
    rootDiv.appendChild(canvas);

    // Ссылка на эффекты https://www.kirilv.com/canvas-confetti/
    // Tailwind CSS Confetti Animation https://preline.co/docs/confetti.html
    canvas.confetti = canvas.confetti || confetti.create(canvas, { resize: true });
    let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    let intervalId = null;

    function startConfettiLoop() {
        intervalId = setInterval(function() {
            let particleCount = 50;
            for (let i = 0; i <= getRandomInt(0, 3); i++) {
                canvas.confetti({ ...defaults, particleCount, origin: { x: getRandomInt(0.3, 0.8), y: Math.random() - 0.2 } });
            }
            
            // since particles fall down, start a bit higher than random
            canvas.confetti({ ...defaults, particleCount, origin: { x: getRandomInt(0.1, 0.3), y: Math.random() - 0.2 } });
            canvas.confetti({ ...defaults, particleCount, origin: { x: getRandomInt(0.7, 0.9), y: Math.random() - 0.2 } });
            
        }, 1000);
    }

    function stopConfettiLoop() {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    // Останавливаем или запускаем спавн конфетти если пользователь на странице или ушел с нее
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            startConfettiLoop();
        } else {
            stopConfettiLoop();
        }
    });

    // Стартуем при загрузке, если вкладка активна
    if (document.visibilityState === "visible") {
        startConfettiLoop();
    }
}