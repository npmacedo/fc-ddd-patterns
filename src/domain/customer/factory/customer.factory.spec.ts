import { Address } from "../value-object/address";
import { CustomerFactory } from "./customer.factory";

describe("Customer factory unit test", () => {
  it("should create a customer", () => {
    let customer = CustomerFactory.create("Customer 1");

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("Customer 1");
    expect(customer.address).toBeUndefined();
  });

  it("should create a customer with an address", () => {
    let address = new Address("Street", 123, "12345", "City 1");

    let customer = CustomerFactory.createWithAddress("Customer 1", address);

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("Customer 1");
    expect(customer.address).toBe(address);
  });
});
