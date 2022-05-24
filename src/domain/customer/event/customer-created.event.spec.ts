import { EventDispatcher } from "../../@shared/event/event-dispatcher";
import { CustomerService } from "../service/customer.service";
import { LogCustomerCreated1Handler } from "./handler/log-customer-created-1.handler";
import { LogCustomerCreated2Handler } from "./handler/log-customer-created-2.handler";

describe("Customer created event unit tests", () => {
  it("should handle LogCustomerCreated1 and LogCustomerCreated2 when user is created", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new LogCustomerCreated1Handler();
    const eventHandler2 = new LogCustomerCreated2Handler();
    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    const customerService = new CustomerService(eventDispatcher);

    customerService.createCustomer({ id: "c1", name: "Customer 1" });

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });
});
