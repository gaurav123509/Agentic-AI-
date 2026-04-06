import AppError from "../utils/appError.js";

export const notFoundHandler = (req, res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  if (statusCode >= 500) {
    console.error("API error:", error);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
