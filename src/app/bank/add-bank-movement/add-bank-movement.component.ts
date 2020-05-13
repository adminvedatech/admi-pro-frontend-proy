import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Product } from 'src/app/production/Product.model';
import { ProductionService } from 'src/app/production/production.service';
import { BankService } from '../bank.service';
import { Bank } from '../bank.model';
import { AccountService } from 'src/app/account/account.service';
import { SubAccount } from 'src/app/account/account.model';
import Swal from "sweetalert2";


@Component({
  selector: 'app-add-bank-movement',
  templateUrl: './add-bank-movement.component.html',
  styleUrls: ['./add-bank-movement.component.css']
})
export class AddBankMovementComponent implements OnInit {

  public form: FormGroup;
  bankAcc: Bank[] = [];
  subAccounts: SubAccount[]=[];
  entrada: Boolean = false;
  cantidad: number;
  sumDebit:number= 0;
  sumCredit:number=0;


  constructor(private fb: FormBuilder,
              private _bankService: BankService,
              private _accountService: AccountService
    ) { }

  ngOnInit() {

    this.form = this.fb.group({
      id: [""],
      bank: this.fb.group({
        id: ['', Validators.required]
      }),
      dateOperation: ["", [Validators.required]],
      date: ["", Validators.required],
      reference: ['', Validators.required],
      paymentTo: ['', Validators.required],
      cantidad: ['',Validators.required],
      deposit: [""],
      withdraw: [""],
      balance: [""],
      details: [""],
      poliza: this.fb.array([]),
    });

    this.getAllProducts();
    this.getAllSubAccounts();

  }

  onEntrada(){
    this.entrada = true;
    console.log('ENTRADA ', this.entrada);
    this.inverseArrayContent();

  }

  onSalida() {
    this.entrada = false;
    console.log('ENTRADA ', this.entrada);
    this.inverseArrayContent();

  }


  createRawMaterials(): FormGroup {
    return this.fb.group({
      id: [''],
      date:['', Validators.required],
      accountName:[''],
      accountNumber: ['',Validators.required],
      subAccountName:['', Validators.required],
      subAccountNumber: ['',Validators.required],
      debit: ['',Validators.required],
      credit: ['',Validators.required]
    })
  }


  removeMaterials(id: number) {
    this.materials.removeAt(id);

 }

  get materials(): FormArray {
    return this.form.get("poliza") as FormArray;
  }

  addMaterials() {
     this.materials.push(this.createRawMaterials());
  }


  getAllProducts() {
    this._bankService.getAllBankAccounts().subscribe(res => {
      this.bankAcc = res;

    });
  }



  getAllSubAccounts() {
    this._accountService.getAllSubAccounts().subscribe(res => {
      this.subAccounts = res;

    });
  }



  selectedItem(event, id) {

      if(!this.entrada){
        this.llenarPolizaDeCheque(event, id);
      }else {
        this.llenarPolizaDeIngreso(event, id);
      }

      this.arrayPolizaSumValues();

  }



  recalculateCost() {

    let arrayPoliza = this.form.get('poliza') as FormArray;
    if(arrayPoliza.length > 0){

      Swal.fire({
        icon: "error",
        text: "Agrege de nuevo la poliza, si se cambia la cantidad con las polizas llenas se borrara la poliza",
        title: "Borrado de Poliza"
      });

      this.cleanPoliza();
    }

  }



  onSubmit(){

    if (!this.verifySumPolizas()){

    } else {

      this.depositOrWithdraw();
      let myDate = this.getDate(this.form.get('dateOperation').value);
      this.form.get('dateOperation').setValue(myDate);
      let myDate2 = this.getDate(this.form.get('date').value);
      this.form.get('date').setValue(myDate2);
      let resource = JSON.stringify(this.form.value);
      this._bankService.addBankMovement(resource).subscribe(res=> {
      this.cleanForm();

      });


    }

    }


    cleanForm(){
     this.form.get('dateOperation').setValue('');
     this.form.reset();
    this.entrada = false;
    this.cleanPoliza();
  }

  getDate(date) {

      var parts = date.split("-")
      return new Date(parts[0], parts[1] - 1, parts[2])

   }



  enterValues(i){
    var arrayControl = this.form.get("poliza") as FormArray;
    arrayControl.controls[i].get('credit').setValue(0);

    this.arrayPolizaSumValues();

  }

  enterValuesCredit(i){
    var arrayControl = this.form.get("poliza") as FormArray;
    arrayControl.controls[i].get('debit').setValue(0);

    this.arrayPolizaSumValues();
  }


  llenarPolizaDeCheque(event, id){

    const resultado = this.subAccounts.find( res => res.id === event.target.selectedIndex+1);
    var arrayControl = this.form.get("poliza") as FormArray;
    let myDate = this.getDate(this.form.get('dateOperation').value);
    arrayControl.controls[id].get('date').setValue(myDate);
    arrayControl.controls[id].get('accountName').setValue(resultado.cuentas.name);
    arrayControl.controls[id].get('accountNumber').setValue(resultado.cuentas.account);
    arrayControl.controls[id].get('subAccountName').setValue(resultado.nameSubAccount);
    arrayControl.controls[id].get('subAccountNumber').setValue(resultado.subAccountNumber);

     if(resultado.cuentas.name === "Bancos"){
      arrayControl.controls[id].get('debit').setValue(0);
      arrayControl.controls[id].get('credit').setValue(this.form.get('cantidad').value);

    }else{
      arrayControl.controls[id].get('credit').setValue(0);
      arrayControl.controls[id].get('debit').setValue(this.form.get('cantidad').value);
    }

  }


  llenarPolizaDeIngreso(event, id){

    const resultado = this.subAccounts.find( res => res.id === event.target.selectedIndex+1);
    var arrayControl = this.form.get("poliza") as FormArray;
    let myDate = this.getDate(this.form.get('dateOperation').value);
    arrayControl.controls[id].get('date').setValue(myDate);
    arrayControl.controls[id].get('accountName').setValue(resultado.cuentas.name);
    arrayControl.controls[id].get('accountNumber').setValue(resultado.cuentas.account);
    arrayControl.controls[id].get('subAccountName').setValue(resultado.nameSubAccount);
    arrayControl.controls[id].get('subAccountNumber').setValue(resultado.subAccountNumber);

    if(resultado.cuentas.name === "Bancos"){
      var arrayControl = this.form.get("poliza") as FormArray;
      arrayControl.controls[id].get('credit').setValue(0);
      arrayControl.controls[id].get('debit').setValue(this.form.get('cantidad').value);


    }else{
      var arrayControl = this.form.get("poliza") as FormArray;
      arrayControl.controls[id].get('debit').setValue(0);
      arrayControl.controls[id].get('credit').setValue(this.form.get('cantidad').value);
    }

  }

  inverseArrayContent(){
    var arrayControl = this.form.get("poliza") as FormArray;
    if(arrayControl.length>0){

        for(let i = 0; i< arrayControl.length; i++) {
         let credit =  arrayControl.controls[i].get('credit').value;
         let debit =  arrayControl.controls[i].get('debit').value
         arrayControl.controls[i].get('debit').setValue(credit);
         arrayControl.controls[i].get('credit').setValue(debit);

        }

    }
  }

  cleanPoliza(){
    let arrayPoliza =  this.form.get("poliza") as FormArray;
    for(let i = 0 ; i < arrayPoliza.length; i++){
      this.materials.removeAt(i);
    }
    this.materials.removeAt(0);
      this.sumCredit=0;
      this.sumDebit=0;
  }


  verifySumPolizas() {

   this.arrayPolizaSumValues();
   if(!this.compareNum(this.sumDebit, this.sumCredit)){
       return false;
    }else{
      return true;
    }

  }

  compareNum(num1:number, num2:number) {
    let num: number = this.form.get('cantidad').value;

    if(num1!=num2){
      Swal.fire({
        icon: "error",
        text: "Las sumas no corresponden en la poliza, verifique",
        title: "Suma de Poliza"
      });
      return false;
    }else{
      if(num1!=num) {
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


   depositOrWithdraw(){

    if(this.entrada){
      this.form.get('deposit').setValue(this.form.get('cantidad').value);
      this.form.get('withdraw').setValue(0);

     }else {
      this.form.get('withdraw').setValue(this.form.get('cantidad').value);
      this.form.get('deposit').setValue(0);

     }

 }


    arrayPolizaSumValues(){

      let arrayPoliza = this.form.get('poliza') as FormArray;
      this.sumDebit=0;
      this.sumCredit=0;
     for(let i =0; i< arrayPoliza.length; i++){

       this.sumDebit = this.sumDebit + arrayPoliza.controls[i].get('debit').value;
       this.sumCredit = this.sumCredit + arrayPoliza.controls[i].get('credit').value;
     }

    }

}
