import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../account.service';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { SubAccount } from '../account.model';
import { Bank } from 'src/app/bank/bank.model';

@Component({
  selector: 'app-edit-accounting-policy',
  templateUrl: './edit-accounting-policy.component.html',
  styleUrls: ['./edit-accounting-policy.component.css']
})
export class EditAccountingPolicyComponent implements OnInit {

  id: string="";
  orderForm: FormGroup;
  item: FormGroup;
  subAccounts: SubAccount[] = [];
  subAccount:SubAccount;
  bankMovementRegister:any;
  sumDebit=0;
  sumCredit=0;
  difSum=0;
  contador=0;
  contador2=0;
  itemsPolizas: FormArray;
  bank: Bank;

  poliza = {

    id :'',
    accountName:'',
    accountNumber:'',
    subAccountNumber:'',
    subAccountName:'',
    date: '',
    concept: '',
    debit: '',
    credit: '',
  }

  constructor( private _router: Router, private _route: ActivatedRoute, private _accountService: AccountService,
               private formBuilder: FormBuilder ) { }

  ngOnInit(): void {

    this.orderForm = this.formBuilder.group({
      bankMovementRegister: this.formBuilder.group({
        bank: this.formBuilder.group({
          balance:'',
          bankAccount:'',
          bankName:'',
          id:null,
          initialBalance:'',
          subAccount:''
        }),
        codTransac:'',
        depositos:'',
        descripcionDetallada:'',
        fecha:'',
        fechaOperacion:'',
        id:'',
        polizaNumber:'',
        referencia:'',
        retiros:'',
        saldo:''
      }),
      id:null,
      type: ['', Validators.required],
      concept: '',
      polizaNumber: ['', Validators.required],
      date: ['', Validators.required],
      itemsPolizas: this.formBuilder.array([])
    });


    this.id = this._route.snapshot.paramMap.get("id");
    this.getPoliza(this.id);
    this.addItem();

    this.getAllSubAccount();
  }


  addItem(): void {
    this.contador = this.contador +1;
    this.itemsPolizas = this.orderForm.get('itemsPolizas') as FormArray;
    this.itemsPolizas.push(this.createItem());
  }


  createItem(): FormGroup {
     this.item = this.formBuilder.group({
      id:'',
      accountName:'',
      accountNumber:'',
      subAccountNumber:'',
      subAccountName:'',
      date: '',
      concept: '',
      debit: '',
      credit: '',
    });

    return this.item;
  }


  removeItem(i: number) {
    this.itemsPolizas = this.orderForm.get('itemsPolizas') as FormArray;
    this.itemsPolizas.removeAt(i);
    this.arrayPolizaSumValues();
  }


  get materials(): FormArray {
    return this.orderForm.get("itemsPolizas") as FormArray;
  }


  enterValuesCredit(i){
    var arrayControl = this.orderForm.get("itemsPolizas") as FormArray;
    arrayControl.controls[i].get('debit').setValue(0);
    this.arrayPolizaSumValues();
  }

  enterValues(i){
    var arrayControl = this.orderForm.get("itemsPolizas") as FormArray;
    arrayControl.controls[i].get('credit').setValue(0);
    this.arrayPolizaSumValues();
  }


  arrayPolizaSumValues(){

    let arrayPoliza = this.orderForm.get('itemsPolizas') as FormArray;
    this.sumDebit=0;
    this.sumCredit=0;
   for(let i =0; i< arrayPoliza.length; i++){
     this.sumDebit = this.sumDebit + arrayPoliza.controls[i].get('debit').value;
     this.sumCredit = this.sumCredit + arrayPoliza.controls[i].get('credit').value;
   }

   this.difSum = this.sumCredit-this.sumDebit;

  }



  getPoliza(numer){

   this._accountService.getBankMovementPolizaByNumber(numer).subscribe(res => {
   this.contador2 = this.contador2 +1;
   const resultado: object = res;
   console.log('POLIZA ', res);

   this.orderForm.get('bankMovementRegister').setValue(res.bankMovementRegister);
   this.orderForm.get('type').setValue(res.type);
   this.orderForm.get('polizaNumber').setValue(res.polizaNumber);
   this.orderForm.get('concept').setValue(res.concept);
   let dateTrans = new Date(res.date);
   this.orderForm.get('date').setValue(res.date);
   this.orderForm.get('id').setValue(res.id);
   this.item.setValue(res.itemsPolizas[0]);

  for(let i=1; i< res.itemsPolizas.length; i++){
    this.addItem();
    this.item.setValue(res.itemsPolizas[i]);
    this.itemsPolizas.push(this.item);
    this.removeItem(i);
  }

  })

  }

  getAllSubAccount() {
    this._accountService.getAllSubAccounts().subscribe(res => {
        this.subAccounts = res;
    });
  }

  addConcept(event, i){
    this.subAccount =  this.subAccounts.find(res => res.subAccountNumber === event.target.value);
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

  onSubmit() {
    this._accountService.updatePoliza(this.orderForm.value).subscribe(res=> {
    })
  }
}
