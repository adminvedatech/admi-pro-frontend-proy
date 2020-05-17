import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BankService } from '../bank/bank.service';
import { AccountService } from './account.service';
import { SubAccount } from './account.model';
import { Bank } from '../bank/bank.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import Swal from "sweetalert2";


@Injectable({
  providedIn: 'root'
})
export class PolizaService {

  itemsPolizas:FormArray;
  item: FormGroup;
  bankMovementRegister: any;
  subAccounts: SubAccount[]=[];
  subAccount:SubAccount;
  sumDebit=0;
  sumCredit=0;
  difSum=0;
  bank: Bank;
  date: any;
  compareNumber: number=0;
  message: string="";
  isReadOnly: boolean;

  poliza = {
    id: "",
    type: "",
    concept:"",
    date: "",
    itemsPolizas:[],
  }

  cleanPoliza = {
    id: "",
    type: "",
    concept:"",
    date: "",
    itemsPolizas:[
      {
        id:'',
     date: '',
     accountName:'',
     accountNumber:'',
     subAccountNumber:'',
     subAccountName:'',
     concept: '',
     debit: '',
     credit: '',
      }
    ],
  }


  constructor(public formBuilder: FormBuilder, public _bankservice:BankService,
              public accountservice: AccountService) {

   }

   orderForm:FormGroup = this.formBuilder.group({
    id:[''],
    type: ['', Validators.required],
    concept: '',
    date: ['', Validators.required],
    itemsPolizas: this.formBuilder.array([])
  });

  createItem(): FormGroup {
    this.item = this.formBuilder.group({
     id:'',
     date: '',
     accountName:'',
     accountNumber:'',
     subAccountNumber:'',
     subAccountName:'',
     concept: '',
     debit: '',
     credit: '',
   });

   return this.item;
 }


  addItem(): void {
    this.itemsPolizas = this.orderForm.get('itemsPolizas') as FormArray;
    this.itemsPolizas.push(this.createItem());

  }

  removeItem(i: number) {
    this.itemsPolizas = this.orderForm.get('itemsPolizas') as FormArray;
    this.itemsPolizas.removeAt(i);
    // this.arrayPolizaSumValues();
  }

  get materials(): FormArray {
    return this.orderForm.get("itemsPolizas") as FormArray;
  }


  // Carga el movimiento Bancario con la Poliza para ser Editado
  getBankMovementRegisterById(id: any){
    this.message ="Usted esta editando la Poliza"
    this.isReadOnly = true;
    this.itemsPolizas = this.orderForm.get('itemsPolizas') as FormArray;
    this._bankservice.getBankMovementRegisterById(id).subscribe(res => {
      this.bankMovementRegister = res;
      console.log('BANK MOVEMENT REGISTER ', this.bankMovementRegister);
      let data = JSON.stringify(this.bankMovementRegister.poliza);
      this.compareNumber = this.bankMovementRegister.depositos + this.bankMovementRegister.retiros;
      for(let i =0; i < this.bankMovementRegister.poliza.itemsPolizas.length; i++){
        this.addItem();
      }
      this.orderForm.setValue(this.bankMovementRegister.poliza);

      let date = this.getDate(this.bankMovementRegister.fechaOperacion);
      this.orderForm.get('date').setValue(date);

    })
  }

   // SE BUSCA EL MOVIMIENTO BANCARIO POR ID, SE AGREGA CONCEPTO, FECHA Y SE MANDA VERIFICAR EL TIPO DE POLIZA "Eg" o "Ig"
   getBankMovementCsvById(id:any){

    this._bankservice.getBankMovementCsvById(id).subscribe(res=>{
      this.bankMovementRegister = res;
      console.log('BANK MOVEMENT CSV IN SERVICE', this.bankMovementRegister);

      // this.orderForm.get('concept').setValue(this.bankMovementRegister.descripcionDetallada); /* Se agrega concepto a la poliza */
      // let date = this.getDate(this.bankMovementRegister.fechaOperacion);                      /* Se agrega fecha a la poliza */
      // this.orderForm.get('date').setValue(date);
      this.selectPolizaType();                                                                /* Selecciona el Tipo de Poliza Eg Ig */
      let data:string= this.bankMovementRegister.cuenta;                                      /* Se pide el Bank por no de Cuenta */
       this.getBankByAccount(data);                                                           /* Se dirige a pedir el Bank por no de Cuenta */
    });

  }


    /* Se Seleccciona que tipo de Poliza si es de Eg o Ig se agrega el ItemPoliza 0 se agrega en el Debito o Credito */
    selectPolizaType(){
      this.orderForm.get('concept').setValue(this.bankMovementRegister.descripcionDetallada); /* Se agrega concepto a la poliza */
       this.date = this.getDate(this.bankMovementRegister.fechaOperacion);                      /* Se agrega fecha a la poliza */
      this.orderForm.get('date').setValue(this.date);
      this.itemsPolizas.controls[0].get('date').setValue(this.date);
      if(this.bankMovementRegister.depositos !== 0){
          this.orderForm.get('type').setValue("Ig");
          this.compareNumber = this.bankMovementRegister.depositos;
          this.itemsPolizas.controls[0].get('debit').setValue(this.bankMovementRegister.depositos);
          this.itemsPolizas.controls[0].get('credit').setValue(0);
     }else {
         this.orderForm.get('type').setValue("Eg");
         this.compareNumber = this.bankMovementRegister.retiros;
         this.itemsPolizas.controls[0].get('credit').setValue(this.bankMovementRegister.retiros);
         this.itemsPolizas.controls[0].get('debit').setValue(0);
     }
    }


     // SE CARGA LA CUENTA DA BANCO Y SE DIRIGE A LLENAR LOS ITEMS DE POLIZA
     getBankByAccount(data: string){
      this._bankservice.getBankByAccount(data).subscribe(res=>{
        this.bank = res;                                                     /* Se carga el Banco por Cuenta */
        this.fillFirstItemsPoliza();                                              /* Se pide llenar los Items de Poliza */
      })
    }

     // SE LLENA EL PRIMER ITEM DE LA POLIZA DE INGRESO O DE EGRESO CON EL NOMBRE DE LA CUENTA, NUMERO DE CUENTA, NOMBRE DE SUBCUENTA, NUMERO DE SUBCUENTA
  // se carga el itemsPolizas, manda verificar la suma de las columnas de Debito y Credito
  fillFirstItemsPoliza(){
    this.subAccount =  this.subAccounts.find(res => res.subAccountNumber === this.bank.subAccount);
   this.itemsPolizas = this.orderForm.get('itemsPolizas') as FormArray;
   this.itemsPolizas.controls[0].get('accountName').setValue(this.subAccount.cuentas.name);
   this.itemsPolizas.controls[0].get('accountNumber').setValue(this.subAccount.cuentas.account);
   this.itemsPolizas.controls[0].get('subAccountNumber').setValue(this.subAccount.subAccountNumber);
   this.itemsPolizas.controls[0].get('subAccountName').setValue(this.subAccount.nameSubAccount);
   this.arrayPolizaSumValues();
  }


    addConcept(event, i){
      this.subAccount =  this.subAccounts.find(res => res.subAccountNumber === event.target.value);
      this.itemsPolizas.controls[i].get('date').setValue(this.date);
      this.itemsPolizas.controls[i].get('accountName').setValue(this.subAccount.cuentas.name);
      this.itemsPolizas.controls[i].get('accountNumber').setValue(this.subAccount.cuentas.account);
      this.itemsPolizas.controls[i].get('subAccountNumber').setValue(this.subAccount.subAccountNumber);
      this.itemsPolizas.controls[i].get('subAccountName').setValue(this.subAccount.nameSubAccount);
        if(this.orderForm.get('type').value ==='Ig') {
          this.itemsPolizas.controls[i].get('credit').setValue(this.bankMovementRegister.depositos);
          this.itemsPolizas.controls[i].get('debit').setValue(0);
          this.arrayPolizaSumValues();
        }else {
          this.itemsPolizas.controls[i].get('debit').setValue(this.bankMovementRegister.retiros);
          this.itemsPolizas.controls[i].get('credit').setValue(0);
          this.arrayPolizaSumValues();
        }
    }

  getDate(date) {
    var parts = date.split("/")
    return new Date(parts[2], parts[1] - 1, parts[0]).toISOString().substring(0,10);
  }

  getAllSubAccount() {
    this.accountservice.getAllSubAccounts().subscribe(res => {
        this.subAccounts = res;
    });
  }


   /* Keyup desde html ItemsPolizas Credit coloca un 0 en Debit  */
   enterValuesCredit(i){
    var arrayControl = this.orderForm.get("itemsPolizas") as FormArray;
    arrayControl.controls[i].get('debit').setValue(0);
    this.arrayPolizaSumValues();    /* Calcula las columnas de Debit y Credit */
  }

  /* Keyup desde ItemsPolizas Debit */
  enterValuesDebit(i){
    var arrayControl = this.orderForm.get("itemsPolizas") as FormArray;
    arrayControl.controls[i].get('credit').setValue(0);
    this.arrayPolizaSumValues();
  }

     /* Calcula las sumas de cada ItemsPolizas y las guarda */
     arrayPolizaSumValues(){
      let arrayPoliza = this.orderForm.get('itemsPolizas') as FormArray;
      this.sumDebit=0;
      this.sumCredit=0;
     for(let i =0; i< arrayPoliza.length; i++){
       this.sumDebit = this.sumDebit + arrayPoliza.controls[i].get('debit').value;
       this.sumCredit = this.sumCredit + arrayPoliza.controls[i].get('credit').value;
     }

     this.difSum = this.sumCredit-this.sumDebit;
     console.log('dif Sum ', this.difSum);


    }

    clearPoliza(){
     console.log('ARRAY POLIZA ', this.createItem());
     console.log('POLIZA ', this.poliza);

      let arrayPoliza = this.orderForm.get('itemsPolizas') as FormArray;
      for(let i =0; i< arrayPoliza.length +1; i++){
        this.removeItem(i);
      }
      this.orderForm.setValue(this.cleanPoliza);
      this.sumCredit=0;
      this.sumDebit=0;
      this.difSum=0;

    }


     /* Manda comparar las sumas de Credit y Debit */
  verifySumPolizas() {
    this.arrayPolizaSumValues();
    if(!this.compareNum(this.sumDebit, this.sumCredit)){
      console.log('FALSE');

        return false;
     }else{
       console.log('TRUE');

       return true;
     }
   }


    /* Regresa un mensaje de error si las sumas de Debit y Credit no son igulaes */
  compareNum(num1:number, num2:number) {
    console.log('NUM1 ', num1);
    console.log('NUM2 ', num1);
    console.log('COMPARE NUMBER ', this.compareNumber);


  //  let num: number = this.bankMovementRegister.depositos;
    if(num1!=num2){
      Swal.fire({
        icon: "error",
        text: "Las sumas no corresponden en la poliza, verifique",
        title: "Suma de Poliza"
      });
      return false;
    }else{
      if(num1!=this.compareNumber) {
        Swal.fire({
          icon: "error",
          text: "Las sumas en la poliza no corresponden a la cantidad del cheque, verifique",
          title: "Cheque y Poliza"
        });
        return false;
      }else {
        return true;
      }
    }

  }

  sendData(){
    let data2 = this.orderForm.value;
    this.bankMovementRegister.poliza = data2;
    let data3 = JSON.stringify(this.bankMovementRegister);

    // Se manda al Servidor
  this.accountservice.createPoliza(data3).subscribe(res => {
    console.log('RES ', res);

    this.clearPoliza();
    Swal.fire({
      icon: "success",
      text: "Se agrego la Poliza a la Base de Datos con exito",
      title: "Agregar Poliza"
    });

    // switch(this.url){
    //   case 'br':  this.router.navigateByUrl('/bank/bank-movement-register');
    //   break;
    //   case 'csv': this.router.navigateByUrl('/bank/add-file-bankmovement');
    //   console.log('CSV BANK');
    //   break;
     // default: this.getBankMovementCsvById(this.id);
   // }

  });


  }

}
