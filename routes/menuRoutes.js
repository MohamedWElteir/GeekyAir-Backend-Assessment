const express = require("express");
const {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");
const {
  authenticate,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: API for managing menu items
 */

/**
 * @swagger
 * /menu:
 *   post:
 *     summary: Create a new menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Pizza"
 *               description:
 *                 type: string
 *                 example: "Delicious cheese pizza"
 *               price:
 *                 type: number
 *                 example: 9.99
 *               category:
 *                 type: string
 *                 example: "Main Course"
 *     responses:
 *       201:
 *         description: Menu item created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/", authenticate, authorizeAdmin, createMenuItem);

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Get all menu items
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: A list of menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1234"
 *                   name:
 *                     type: string
 *                     example: "Pizza"
 *                   description:
 *                     type: string
 *                     example: "Delicious cheese pizza"
 *                   price:
 *                     type: number
 *                     example: 9.99
 *                   category:
 *                     type: string
 *                     example: "Main Course"
 */
router.get("/", getMenuItems);

/**
 * @swagger
 * /menu/{id}:
 *   get:
 *     summary: Get a menu item by ID
 *     tags: [Menu]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "1234"
 *     responses:
 *       200:
 *         description: Menu item details
 *       404:
 *         description: Menu item not found
 */
router.get("/:id", getMenuItemById);

/**
 * @swagger
 * /menu/{id}:
 *   put:
 *     summary: Update a menu item by ID
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "1234"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Pizza"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               price:
 *                 type: number
 *                 example: 11.99
 *               category:
 *                 type: string
 *                 example: "Main Course"
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *       404:
 *         description: Menu item not found
 */
router.put("/:id", authenticate, authorizeAdmin, updateMenuItem);

/**
 * @swagger
 * /menu/{id}:
 *   delete:
 *     summary: Delete a menu item by ID
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "1234"
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 *       404:
 *         description: Menu item not found
 */
router.delete("/:id", authenticate, authorizeAdmin, deleteMenuItem);

module.exports = router;
