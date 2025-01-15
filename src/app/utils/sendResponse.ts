const sendResponse = (res, data) => {
  res.send({
    status: true,
    message: data.message,
    data: data.result,
  });
};
export default sendResponse;
