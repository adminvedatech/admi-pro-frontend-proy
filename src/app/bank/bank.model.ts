import { Poliza } from '../account/account.model';


export class Bank {
  id: null;
  bankName: string;
bankAccount: string;
subAccount: string;
initialBalance: string;
balance: string;

}

export class BankMovementRegister {

  id: string;
  codTransac: string;
  cuenta: string;
  depositos: string;
  descripcion: string;
  descripcionDetallada: string;
  enabled: boolean;
  fecha:string;
  fechaOperacion:string;
  movimiento: string;
  referencia:string;
  retiros:string;
  saldo: string;
  sucursal:string;
  poliza: Poliza;
}
