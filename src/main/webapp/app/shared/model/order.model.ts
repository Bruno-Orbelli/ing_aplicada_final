import dayjs from 'dayjs';
import { IOrderDet } from 'app/shared/model/order-det.model';

export interface IOrder {
  id?: number;
  clientName?: string | null;
  orderedAt?: string | null;
  isDelivered?: boolean | null;
  deliveredAt?: string | null;
  orderDetails?: IOrderDet[] | null;
}

export const defaultValue: Readonly<IOrder> = {
  isDelivered: false,
};
