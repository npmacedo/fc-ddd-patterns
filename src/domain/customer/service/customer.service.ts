import { EventDispatcherInterface } from "../../@shared/event/event-dispatcher.interface";
import { Address } from "../value-object/address";
import { Customer } from "../entity/customer";
import { CustomerAddressChangedEvent } from "../event/customer-address-changed.event";

import { CustomerCreatedEvent } from "../event/customer-created.event";

export class CustomerService {
  constructor(private eventDispatcher: EventDispatcherInterface) {}

  createCustomer(customerData: { id: string; name: string }): Customer {
    const customer = new Customer(customerData.id, customerData.name);
    const customerCreatedEvent = new CustomerCreatedEvent(customer);
    this.eventDispatcher.notify(customerCreatedEvent);
    return customer;
  }

  changeCustomerAddress(customer: Customer, newAddress: Address) {
    customer.changeAddress(newAddress);
    const customerAddressChangedEvent = new CustomerAddressChangedEvent(
      customer
    );
    this.eventDispatcher.notify(customerAddressChangedEvent);
  }
}
