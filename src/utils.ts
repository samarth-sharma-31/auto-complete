
// This util helps in creating a debounced function which only calls the input function
// when a certain amount of time (wait) has elapsed after the the most recent action.
export function debounce(fn: (...args: any) => any, wait = 300){
    let timeoutId: NodeJS.Timeout;

    return function(){
        const args = Array.from(arguments);


        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            fn(...args)
        }, wait)

    }

}