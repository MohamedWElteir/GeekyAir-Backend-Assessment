const orderModel = require("../models/order");
const orderItemModel = require("../models/orderItem");
const menuItemModel = require("../models/menuItem");


exports.createOrder = async (req, res) => {
  try {
    await orderModel.createOrder(req.user.id);
    res.status(201).json({ message: "Order created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating order", error: err.message });
  }
};


exports.addItemToOrder = async (req, res) => {
  const { id } = req.params;
  const { menuItemId, quantity } = req.body;

  try {
    await orderItemModel.addItemToOrder(id, menuItemId, quantity);
    res.status(200).json({ message: "Item added to order successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding item to order", error: err.message });
  }
};


exports.removeItemFromOrder = async (req, res) => {
  const { id } = req.params;
  const { menuItemId } = req.body;

  try {
    await orderItemModel.removeItemFromOrder(id, menuItemId);
    res.status(200).json({ message: "Item removed from order successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error removing item from order", error: err.message });
  }
};


exports.completeOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await orderModel.updateOrderStatus(id, "complete");
    if (!updated)
      return res
        .status(404)
        .json({ message: "Order not found or already completed" });

    res.status(200).json({ message: "Order marked as complete" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error completing order", error: err.message });
  }
};

// (Admin only)
exports.getOrders = async (req, res) => {
  try {
    
    const orders = await orderModel.getAllOrders();

   
    const detailedOrders = await Promise.all(
      orders.map(async (order) => {
        const items = await orderItemModel.getItemsByOrderId(order.id);
        const detailedItems = await Promise.all(
          items.map(async (item) => {
            const menuItem = await menuItemModel.getMenuItem(item.menuItemId);
            return {
              menuItem: menuItem, 
              quantity: item.quantity,
            };
          })
        );
        return { ...order, items: detailedItems };
      })
    );

    res.status(200).json(detailedOrders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: err.message });
  }
};



exports.getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    
    const order = await orderModel.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

   
    const items = await orderItemModel.getItemsByOrderId(id);
    const detailedItems = await Promise.all(
      items.map(async (item) => {
        const menuItem = await menuItemModel.getMenuItem(item.menuItemId);
        return {
          menuItem: menuItem, 
          quantity: item.quantity,
        };
      })
    );

    res.status(200).json({ order, items: detailedItems });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: err.message });
  }
};
