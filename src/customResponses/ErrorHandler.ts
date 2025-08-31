class ErrorHandler extends Error {
    statusCode: Number;
    constructor(message: any, statusCode: Number) {
        super(message);
        this.statusCode = statusCode;
        //This will exclude the unnessory error that will not help us to debug the code
        // include only nessory error
        Error.captureStackTrace(this, this.constructor)
    }
}

export default ErrorHandler