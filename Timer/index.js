document.addEventListener("DOMContentLoaded", function() {
    let startButton = document.querySelector("#start");
    let pauseButton = document.querySelector("#pause");
    let durationInput = document.querySelector("#duration");
    let circle = document.querySelector("circle");

    let perimeter = 2 * Math.PI * circle.getAttribute("r");
    circle.setAttribute("stroke-dasharray", perimeter);

    let duration;

    let timer = new Timer(durationInput, startButton, pauseButton, {
        onStart(totalDuration) {
            console.log("Timer Started");
            duration = totalDuration;
        },

        onTick(timeRemaining) {
            // We want blank space to go clockwise. This is why offset is negative
            offset = (perimeter * (timeRemaining / duration)) -  perimeter;
            
            circle.setAttribute("stroke-dashoffset", offset);
        },

        onComplete() {
            console.log("Timer Complete");
        }
    });
});
