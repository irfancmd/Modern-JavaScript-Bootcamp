// This function takes a function and returned a modified version of that function
// that can't be called repeatedly for some time
const debounceHelper = (func, delay=500) => {
    // Because of "Closure", this local variable will keep it's value
    // until the inner function is done with it's timer
    let timerId;

    // args will contain the parameters passed into "func"
    return (...args) => {
        // If a timer is already running, stop it
        if(timerId) {
            clearTimeout(timerId);
        }

        // Call the function only if previous call was made at least 
        // "delay" miliseconds ago. Thus, repeated calls with be prevented
        timerId = setTimeout(() => {
            // Call the desired function with appropriate arguments
            func.apply(null, args);
        }, delay);
    }
};
