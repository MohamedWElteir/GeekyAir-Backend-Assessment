const menuItemModel = require("../models/menuItem");


exports.createMenuItem = async (req, res) => {
  const { name, description, price, category } = req.body;

  console.log(name,description,price,category)

     if (!name || !price || !category) {
       return res
         .status(400)
         .json({ message: "Name, price, and category are required" });
     }
  try {
    await menuItemModel.createMenuItem(name, description, price, category);
    res.status(201).json({ message: "Menu item created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating menu item", error: err.message });
  }
};


exports.getMenuItems = async (req, res) => {
 const { sortByPrice, filterByCategory } = req.query;
  try {
    const menuItems = await menuItemModel.getMenuItems(filterByCategory,sortByPrice);
   return res.status(200).json(menuItems);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching menu items", error: err.message });
  }
};


exports.getMenuItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const [menuItem] = await menuItemModel.getMenuItem(id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json(menuItem);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching menu item", error: err.message });
  }
};


exports.updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;

  try {
    const [menuItem] = await menuItemModel.getMenuItem(id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    await menuItemModel.updateMenuItem(id, name, description, price, category);
    res.status(200).json({ message: "Menu item updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating menu item", error: err.message });
  }
};


exports.deleteMenuItem = async (req, res) => {
  const { id } = req.params;

  try {
    const [menuItem] = await menuItemModel.getMenuItems(id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    await menuItemModel.deleteMenuItem(id);
    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting menu item", error: err.message });
  }
};
