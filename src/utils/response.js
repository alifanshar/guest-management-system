export const successResponse = (
  res,
  message,
  data = null,
  pagination = null,
  status = 200
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    pagination,
  });
};
