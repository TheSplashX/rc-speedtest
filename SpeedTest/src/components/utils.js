/**
 * force the UI to wait before continuing
 * @see See https://www.freecodecamp.org/forum/t/how-to-set-a-delay-between-foreach-loop-iteration-solved/88932/3
 * @param {Number} amount time to wait in milliseconds
 * @returns {Promise} promise to wait
 */
export const delay = (amount = number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, amount);
    });
};

/**
 * to set value to state prop in async method
 * @see See https://stackoverflow.com/a/45744345
 * @param {instance} instance of the view
 * @returns {Promise} promise to set the value
 */
export const asyncSetState = instance => newState => {
    new Promise(resolve => instance.setState(newState, resolve));
};
