import { EventHandlerInterface } from "../../../@shared/event/event-handler.interface";
import { EventInterface } from "../../../@shared/event/event.interface";
import { CustomerCreatedEvent } from "../customer-created.event";

export class LogCustomerCreated2Handler
  implements EventHandlerInterface<CustomerCreatedEvent>
{
  handle(event: EventInterface): void {
    console.log(
      'Handler2: EnviaConsoleLog2Handler. Mensagem: "Esse é o segundo console.log do evento: CustomerCreated".'
    );
  }
}
