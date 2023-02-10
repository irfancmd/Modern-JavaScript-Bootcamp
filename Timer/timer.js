class Timer {
    constructor(durationInput, startButton, pauseButton, callbacks) {
        this.durationInput = durationInput;
        this.startButton = startButton;
        this.pauseButton = pauseButton;
        // callbacks is an optional parameter
        if(callbacks) {
            this.onStart = callbacks.onStart;
            this.onTick = callbacks.onTick;
            this.onComplete = callbacks.onComplete;
        }

        this.startButton.addEventListener("click", this.start.bind(this));

        this.pauseButton.addEventListener("click", this.pause.bind(this));
    }

    // Instead of using bind(), we could write these functions as arrow functions:
    // start = () => { // code }; 
    start() {
        if(this.onStart) {
            this.onStart(this.timeRemaining);
        }

        // setInterval() starts after the first tick. So, for visualizing the
        // very first tick, we have to call tick() once manually outside setInterval()
        this.tick();
        // "this" in setInterval's callback will become window object. So we have to
        // bind the desired "this" context
        // The timer will update every 20ms.
        this.intervalID = setInterval(this.tick.bind(this), 20);
    }

    pause() {
        clearInterval(this.intervalID);
    }

    tick() {
        if(this.timeRemaining > 0) {
            this.timeRemaining = this.timeRemaining - 0.02;

            if(this.onTick) {
                this.onTick(this.timeRemaining);
            }
        } else {
            this.pause();

            if(this.onComplete) {
                this.onComplete();
            }
        }
    }

    get timeRemaining() {
        return parseFloat(this.durationInput.value);
    }

    set timeRemaining(time) {
        // Round time to 2 decimal places
        this.durationInput.value = time.toFixed(2);
    }
}
