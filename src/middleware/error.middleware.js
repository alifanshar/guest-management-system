export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const isProduction = process.env.NODE_ENV === "production";

  // Prisma errors
  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "Duplicate field value",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(isProduction ? {} : { error: err.message }),
  });
};
