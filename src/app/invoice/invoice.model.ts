import { CustomerComponent } from '../customer/customer.component';
import { Supplier } from '../supplier/supplier.model';

export class Invoice {
  id: number;
  fecha: Date;
  fechaPago: Date;
  concept: string;
  customer: any;
  supplier: Supplier;
  condicionesPago: string;
  nombreArchivo: string;
  subTotal: number;
  impuesto: number;
  total: number;
  pago: number;
  folio: string;
  payment: boolean;

}
