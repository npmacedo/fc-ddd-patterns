import { EventDispatcher } from "../../@shared/event/event-dispatcher";
import { Address } from "../value-object/address";
import { Customer } from "../entity/customer";
import { CustomerService } from "../service/customer.service";
import { LogCustomerAddressChangedHandler } from "./handler/log-customer-address-changed.handler";

describe("Customer address changed event unit tests", () => {
  it("should handle LogCustomerAddressChanged when the address of a customer is changed", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new LogCustomerAddressChangedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

    const customerService = new CustomerService(eventDispatcher);

    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 123, "12345", "City ABC");

    customerService.changeCustomerAddress(customer, address);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
