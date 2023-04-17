import Joi from 'joi';

type PaymentType = {
  ticketId: number;
  cardData: {
    issuer: string;
    number: number;
    name: string;
    expirationDate: Date;
    cvv: number;
  };
};

export const PaymentSchema = Joi.object<PaymentType>({
  ticketId: Joi.number().required(),
  cardData: Joi.object().required(),
});
