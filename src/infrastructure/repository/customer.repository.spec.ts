import { Sequelize } from "sequelize-typescript";
import { Address } from "../../domain/customer/value-object/address";
import { Customer } from "../../domain/customer/entity/customer";
import { CustomerModel } from "../db/sequelize/model/customer.model";
import { CustomerRepository } from "./customer.repository";

describe("Customer repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([CustomerModel]);

    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 26, "12345", "City 1");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const customerModel = await CustomerModel.findOne({
      where: { id: customer.id },
    });

    expect(customerModel.toJSON()).toStrictEqual({
      id: customer.id,
      name: customer.name,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
      street: customer.address.street,
      number: customer.address.number,
      zipcode: customer.address.zip,
      city: customer.address.city,
    });
  });

  it("should update a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 123, "12345", "City 1");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const address2 = new Address("Street 2", 456, "56789", "City 2");
    customer.changeAddress(address2);
    customer.changeName("Customer 2");
    customer.activate();
    customer.addRewardPoints(50);

    await customerRepository.update(customer);

    const customerModel = await CustomerModel.findOne({
      where: { id: customer.id },
    });

    expect(customerModel.toJSON()).toStrictEqual({
      id: customer.id,
      name: customer.name,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
      street: customer.address.street,
      number: customer.address.number,
      zipcode: customer.address.zip,
      city: customer.address.city,
    });

    expect(customerModel.rewardPoints).toEqual(customer.rewardPoints);
  });

  it("should find a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 123, "12345", "City 1");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const customerResult = await customerRepository.find(customer.id);

    expect(customerResult).toStrictEqual(customer);
  });

  it("should throw an error when customer is not found", async () => {
    const customerRepository = new CustomerRepository();

    await expect(async () => {
      await customerRepository.find("456ABC");
    }).rejects.toThrow("Customer not found");
  });

  it("should find all customers", async () => {
    const customerRepository = new CustomerRepository();

    const customer1 = new Customer("c1", "Customer 1");
    customer1.changeAddress(new Address("Street 1", 123, "12345", "City 1"));
    customer1.addRewardPoints(50);
    await customerRepository.create(customer1);

    const customer2 = new Customer("c2", "Customer 2");
    customer2.changeAddress(new Address("Street 2", 456, "56789", "City 2"));
    customer2.activate();
    await customerRepository.create(customer2);

    const customers = [customer1, customer2];

    const foundCustomers = await customerRepository.findAll();

    expect(customers).toEqual(foundCustomers);
  });
});
