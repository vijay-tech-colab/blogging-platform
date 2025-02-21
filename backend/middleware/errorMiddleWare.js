const ErrorHandler = require('./errorClass');

const errorMiddleware = (err,req,res,next) => {
    err.message = err.message || "Internal server error";
    err.statusCode = err.statusCode || 500;
    // console.log(err);
    if (err.code === 11000) {
        console.log(err);
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    if (err.name === "JsonWebTokenError") {
        console.log(err);
        const message = "JSON Web Token is invalid. Try again.";
        err = new ErrorHandler(message, 400);
    }

    if (err.name === "TokenExpiredError") {
        console.log(err);
        const message = "JSON Web Token has expired.";
        err = new ErrorHandler(message, 400);
    }

    if (err.name === "CastError") {
        console.log(err);
        const message = `Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    const errorMessage = err.errors
        ? Object.values(err.errors)
              .map(error => error.message)
              .join(" ")
        : err.message;

    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage
    });
}

module.exports = errorMiddleware