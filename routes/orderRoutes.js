const express = require("express");
const {
  createOrder,
  addItemToOrder,
  removeItemFromOrder,
  completeOrder,
  getOrders,
  getOrderById,
} = require("../controllers/orderController");
const {
  authenticate,
  authorizeAdmin,
  authorizeStaff,
} = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API for managing orders
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/", authenticate, authorizeStaff, createOrder);

/**
 * @swagger
 * /orders/{id}/add-item:
 *   put:
 *     summary: Add an item to an existing order
 *     tags: [Orders]
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
 *               menuItemId:
 *                 type: string
 *                 example: "5678"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item added to order successfully
 *       404:
 *         description: Order or menu item not found
 */
router.put("/:id/add-item", authenticate, authorizeStaff, addItemToOrder);

/**
 * @swagger
 * /orders/{id}/remove-item:
 *   put:
 *     summary: Remove an item from an existing order
 *     tags: [Orders]
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
 *               menuItemId:
 *                 type: string
 *                 example: "5678"
 *     responses:
 *       200:
 *         description: Item removed from order successfully
 *       404:
 *         description: Order or menu item not found
 */
router.put(
  "/:id/remove-item",
  authenticate,
  authorizeStaff,
  removeItemFromOrder
);

/**
 * @swagger
 * /orders/{id}/complete:
 *   put:
 *     summary: Mark an order as complete
 *     tags: [Orders]
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
 *         description: Order marked as complete
 *       404:
 *         description: Order not found
 */
router.put("/:id/complete", authenticate, authorizeStaff, completeOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
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
 *                   status:
 *                     type: string
 *                     example: "pending"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-12-01T10:00:00Z"
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, authorizeAdmin, getOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get details of a specific order by ID
 *     tags: [Orders]
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
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1234"
 *                 status:
 *                   type: string
 *                   example: "pending"
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       menuItemId:
 *                         type: string
 *                         example: "5678"
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.get("/:id", authenticate, authorizeAdmin, getOrderById);

module.exports = router;
