const User = require("../models/users");
const Order = require("../models/orders");

async function updateUserStats(userId) {
  // Buscar todas las órdenes pagadas del usuario
  const orders = await Order.find({
    user: userId,
    "payment.status": "paid",
  });

  const totalOrders = orders.length;

  const totalSpent = orders.reduce((acc, order) => acc + (order.totals?.total || 0), 0);

  const averageTicket = totalOrders > 0 ? totalSpent / totalOrders : 0;

  const lastPurchaseAt =
    totalOrders > 0
      ? orders.sort((a, b) => b.createdAt - a.createdAt)[0].createdAt
      : null;

  // 🎯 Clasificación automática
  let customerState = "new";

  if (totalOrders === 0) {
    customerState = "new";
  } else if (totalOrders === 1) {
    customerState = "active";
  } else if (totalSpent > 1000) {
    customerState = "vip";
  } else if (totalOrders >= 3) {
    customerState = "recurrent";
  }

  await User.findByIdAndUpdate(userId, {
    stats: {
      totalSpent,
      totalOrders,
      averageTicket,
      lastPurchaseAt,
    },
    customerState,
  });
}

module.exports = updateUserStats;
