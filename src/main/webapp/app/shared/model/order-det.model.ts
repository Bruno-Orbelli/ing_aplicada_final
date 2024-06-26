import { IProduct } from 'app/shared/model/product.model';
import { IOrder } from 'app/shared/model/order.model';

export interface IOrderDet {
  id?: number;
  quantity?: number | null;
  product?: IProduct | null;
  order?: IOrder | null;
}

export const defaultValue: Readonly<IOrderDet> = {};
