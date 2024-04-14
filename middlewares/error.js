class ErrorHandler extends Error {
  constructor(message, statusCode, successFlag) {
    super(message);
    this.statusCode = statusCode;
    this.successFlag = successFlag;
  }
}

export const errorMiddleWare = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error!";
  err.statusCode = err.statusCode || 500;
  err.successFlag = err.successFlag || false;

  return res.status(err.statusCode).json({
    success: err.successFlag,
    message: err.message,
  });
};

export default ErrorHandler;
