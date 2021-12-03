export function errorLog(identifier, payload) {
    if (process.env.NODE_ENV !== 'production') {
        console.error({ [identifier]: payload });
    }
}