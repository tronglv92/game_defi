const ApiSuccess = (res, data) => {
  return res.status(200).json({
    success: true,
    data: data,
  });
};

module.exports = ApiSuccess;
