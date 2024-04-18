const suscriptorSucceded = async (req, res) => {
  const { payer } = req.body;
  const parametro = req.params.parametro;
  console.log(parametro);
  const buyer_id = payer._id;
  const buyer = await User.findOne({ _id: buyer_id });

  await User.findByIdAndUpdate(
    { _id: buyer._id },
    {
      purchases: {
        products: products,
      },
    }
  );

  // Send a response to the client if needed
  res.status(200).json({ message: "Purchase successful" });
};

module.exports = { suscriptorSucceded };
