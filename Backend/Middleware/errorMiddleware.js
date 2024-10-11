// Middleware to handle routes that do not exist (404 Not Found)
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Pass the error to the errorHandler middleware
  };
  
  // Middleware to handle general errors
  const errorHandler = (err, req, res, next) => {
    // Check the status code. If it's 200 (OK), set it to 500 (Internal Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
  
    // Send a JSON response with error details
    res.json({
      message: err.message,
      // Include stack trace only in development mode
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  module.exports = { notFound, errorHandler };
  