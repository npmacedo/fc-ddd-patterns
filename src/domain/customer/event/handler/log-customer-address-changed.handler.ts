import { Customer } from "../../entity/customer";

import { ProductCreatedEvent } from "../../../product/event/product-created.event";
import { EventHandlerInterface } from "../../../@shared/event/event-handler.interface";
import { EventInterface } from "../../../@shared/event/event.interface";

export class LogCustomerAddressChangedHandler
  implements EventHandlerInterface<ProductCreatedEvent>
{
  handle(event: EventInterface): void {
    const customer = event.eventData as Customer;
    console.log(
      `Handler: EnviaConsoleLogHandler. Mensagem: "Endereço do cliente: ${
        customer.id
      }, ${customer.name} alterado para: ${customer.address.toString()}".`
    );
  }
}
