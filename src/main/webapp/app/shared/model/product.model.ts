import { IOrderDet } from 'app/shared/model/order-det.model';

export interface IProduct {
  id?: number;
  productName?: string | null;
  description?: string | null;
  stock?: number | null;
  price?: number | null;
  orderDetails?: IOrderDet[] | null;
}

export const defaultValue: Readonly<IProduct> = {};
