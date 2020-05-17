import { CustomerComponent } from '../customer/customer.component';
import { Supplier } from '../supplier/supplier.model';
import { Poliza } from '../account/account.model';

export class Invoice {
  id: number;
  fecha: Date;
  fechaPago: Date;
  concept: string;
  condicionesPago: string;
  nombreArchivo: string;
  subTotal: number;
  impuesto: number;
  total: number;
  pago: number;
  folio: string;
  payment: boolean;
  poliza: Poliza;
  supplier: Supplier;
  customer: any;


}
