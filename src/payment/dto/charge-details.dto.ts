import { OmitType } from "@nestjs/mapped-types";
import { CreatePaymentDto } from "./create-payment.dto";

export class ChargeDetails extends OmitType(CreatePaymentDto, ['type', 'reservationId', 'amount', 'relatedEntityId']) {}
