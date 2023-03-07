exports.sendIndex = async (req, res) => {
  res.render("index");
};

exports.uploadFile = async (req, res) => {
  res.send("Arquivo recebido!");
};
