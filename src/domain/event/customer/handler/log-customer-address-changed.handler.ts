import { Customer } from "../../../entity/customer";
import { EventHandlerInterface } from "../../@shared/event-handler.interface";
import { EventInterface } from "../../@shared/event.interface";
import { ProductCreatedEvent } from "../../product/product-created.event";

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
