import { Order } from "../../domain/checkout/entity/order";
import { OrderItem } from "../../domain/checkout/entity/order_item";
import { OrderRepositoryInterface } from "../../domain/checkout/repository/order-repository.interface";
import { OrderItemModel } from "../db/sequelize/model/order-item.model";
import { OrderModel } from "../db/sequelize/model/order.model";

export class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: entity.id,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const sequelize = OrderModel.sequelize;

    await sequelize.transaction(async (t) => {
      await OrderItemModel.destroy({
        where: { order_id: entity.id },
        transaction: t,
      });

      const items = entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id,
      }));

      await OrderModel.update(
        { total: entity.total() },
        { where: { id: entity.id }, transaction: t }
      );

      await OrderItemModel.bulkCreate(items, { transaction: t });
    });
  }

  async find(id: string): Promise<Order> {
    try {
      const orderModel = await OrderModel.findOne({
        where: { id },
        include: ["items"],
        rejectOnEmpty: true,
      });

      const items = orderModel.items.map(
        (item) =>
          new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity
          )
      );

      return new Order(orderModel.id, orderModel.customer_id, items);
    } catch (error) {
      throw new Error("Order not found");
    }
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({ include: ["items"] });
    return orderModels.map((orderModel) => {
      const items = orderModel.items.map(
        (item) =>
          new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity
          )
      );
      return new Order(orderModel.id, orderModel.customer_id, items);
    });
  }
}
