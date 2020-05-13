export class AccountType {
    public id: null;
    public name: string;
    public account: string;
    public balance: number;
    public state: boolean;
    public subaccount: SubAccount;

}


export class Cuentas {
  public id: null;
  public name: string;
  public account: string;
  public balance: number;
//  public state: boolean;
//  public subaccount: SubAccount;

}

export class SubAccount {

    public id: null;
    public nameSubAccount: string;
    public subAccountNumber: string;
    public subAccountBalance: number;
    public status: boolean;
    public cuentas: Cuentas;

}

export class Poliza {

    public id: null;
    public type: string;
    public concept: string;
    public date: string;
    public itemsPolizas: [];
}


export class ItemsPoliza {

    public id: null;
    public date: string;
    public accountName:string;
    public accountNumber:string;
    public subAccountNumber: string;
    public subAccountName:string;
    public concept: string;
    public debit: number;
    public credit: number;

}
