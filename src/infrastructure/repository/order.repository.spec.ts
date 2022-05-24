import { Sequelize } from "sequelize-typescript";
import { Order } from "../../domain/checkout/entity/order";
import { OrderItem } from "../../domain/checkout/entity/order_item";
import { Address } from "../../domain/customer/value-object/address";
import { Customer } from "../../domain/customer/entity/customer";

import { Product } from "../../domain/product/entity/product";
import { CustomerModel } from "../db/sequelize/model/customer.model";
import { OrderItemModel } from "../db/sequelize/model/order-item.model";
import { OrderModel } from "../db/sequelize/model/order.model";
import { ProductModel } from "../db/sequelize/model/product.model";
import { CustomerRepository } from "./customer.repository";
import { OrderRepository } from "./order.repository";
import { ProductRepository } from "./product.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);

    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 123, "12345", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "i1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("o1", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          product_id: orderItem.productId,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: order.id,
        },
      ],
    });
  });

  it("should update an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 123, "12345", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product("p1", "Product 1", 10);
    await productRepository.create(product1);

    const item1 = new OrderItem(
      "i1",
      product1.name,
      product1.price,
      product1.id,
      2
    );

    const order = new Order("o1", customer.id, [item1]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const product2 = new Product("p2", "Product 2", 15);
    await productRepository.create(product2);
    const item2 = new OrderItem(
      "i2",
      product2.name,
      product2.price,
      product2.id,
      2
    );
    order.changeItems([item1, item2]);

    await orderRepository.update(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: item1.id,
          product_id: item1.productId,
          name: item1.name,
          price: item1.price,
          quantity: item1.quantity,
          order_id: order.id,
        },
        {
          id: item2.id,
          product_id: item2.productId,
          name: item2.name,
          price: item2.price,
          quantity: item2.quantity,
          order_id: order.id,
        },
      ],
    });
  });

  it("should find an order", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 123, "12345", "City 1");
    customer.changeAddress(address);

    const product = new Product("p1", "Product 1", 10);
    const item = new OrderItem(
      "i1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("o1", customer.id, [item]);

    await customerRepository.create(customer);
    await productRepository.create(product);
    await orderRepository.create(order);

    const orderResult = await orderRepository.find(order.id);

    expect(orderResult).toStrictEqual(order);
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 123, "12345", "City 1");
    customer.changeAddress(address);

    const product = new Product("p1", "Product 1", 10);
    const item1 = new OrderItem(
      "i1",
      product.name,
      product.price,
      product.id,
      2
    );
    const item2 = new OrderItem(
      "i2",
      product.name,
      product.price,
      product.id,
      5
    );

    const order1 = new Order("o1", customer.id, [item1]);
    const order2 = new Order("o2", customer.id, [item2]);

    await customerRepository.create(customer);
    await productRepository.create(product);
    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const orders = [order1, order2];

    const orderResults = await orderRepository.findAll();

    expect(orderResults).toEqual(orders);
  });
});
