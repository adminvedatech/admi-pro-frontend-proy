import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../account.service';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { SubAccount } from '../account.model';
import { Invoice } from 'src/app/invoice/invoice.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-add-diary-policy',
  templateUrl: './add-diary-policy.component.html',
  styleUrls: ['./add-diary-policy.component.css']
})
export class AddDiaryPolicyComponent implements OnInit {
  polizaForm: FormGroup;
  itemsPolizas: FormArray;
  subAccounts: SubAccount[] = [];
  subAccount:SubAccount;
  invoice: Invoice;
  index: number;
  id: string="";
  date;

  sumDebit=0;
  sumCredit=0;
  difSum=0;

  constructor(private _route: ActivatedRoute,
              private _accountservice: AccountService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {


    this.polizaForm = this.formBuilder.group({

      id:[''],
      invoice: this.formBuilder.group({
        id: ''
      }),

      // bankMovementRegister: this.formBuilder.group({
      //   id: ''
      // }),

      type: ['', Validators.required],
      folio:[''],
      concept:[''],
      polizaNumber: ['', Validators.required],
      date: ['', Validators.required],
      itemsPolizas: this.formBuilder.array([])
    });

    let {params} = this._route.snapshot;
    let url = `${params.todo}`;
    let id = `${params.id}`;
    console.log('URL ', id);

    this.addItem();
    this.getAllSubAccount();
    this.getInvoiceById(id);


    //this.fillPoliza();

  }

  createItem(): FormGroup {
    return this.formBuilder.group({

      accountName:'',
      accountNumber:'',
      subAccountNumber:'',
      subAccountName:'',
      date: '',
      concept: '',
      debit: '',
      credit: '',
    });
  }

  removeItem(i: number) {
    this.itemsPolizas = this.polizaForm.get('itemsPolizas') as FormArray;
    this.itemsPolizas.removeAt(i);
    this.arrayPolizaSumValues();
  }


  get materials(): FormArray {
    return this.polizaForm.get("itemsPolizas") as FormArray;
  }

  addItem(): void {
    this.itemsPolizas = this.polizaForm.get('itemsPolizas') as FormArray;
    this.itemsPolizas.push(this.createItem());

  }

  enterValues(i){
    var arrayControl = this.polizaForm.get("itemsPolizas") as FormArray;
    arrayControl.controls[i].get('credit').setValue(0);
    this.arrayPolizaSumValues();
  }

  enterValuesCredit(i){
    var arrayControl = this.polizaForm.get("itemsPolizas") as FormArray;
    arrayControl.controls[i].get('debit').setValue(0);

    this.arrayPolizaSumValues();
  }

  addConcept(event, i){
    this.subAccount =  this.subAccounts.find(res => res.subAccountNumber === event.target.value);
    this.itemsPolizas.controls[i].get('accountName').setValue(this.subAccount.cuentas.name);
    this.itemsPolizas.controls[i].get('accountNumber').setValue(this.subAccount.cuentas.account);
    this.itemsPolizas.controls[i].get('subAccountNumber').setValue(this.subAccount.subAccountNumber);
    this.itemsPolizas.controls[i].get('subAccountName').setValue(this.subAccount.nameSubAccount);

        this.itemsPolizas.controls[i].get('debit').setValue(this.invoice.subTotal);
        this.itemsPolizas.controls[i].get('credit').setValue(0);
        this.arrayPolizaSumValues();

  }

  arrayPolizaSumValues(){
    let arrayPoliza = this.polizaForm.get('itemsPolizas') as FormArray;
    this.sumDebit=0;
    this.sumCredit=0;
   for(let i =0; i< arrayPoliza.length; i++){
     this.sumDebit = this.sumDebit + arrayPoliza.controls[i].get('debit').value;
     this.sumCredit = this.sumCredit + arrayPoliza.controls[i].get('credit').value;
   }

   this.difSum = this.sumCredit-this.sumDebit;

  }

  onSubmit() {

    this._accountservice.createPoliza(this.polizaForm.value).subscribe(res => {
      console.log('RESPUESTA SERVICDOR ', res);

    });
        console.log('FORM VALUE ', this.polizaForm.value);

  }

  getAllSubAccount() {
    this._accountservice.getAllSubAccounts().subscribe(res => {
        this.subAccounts = res;
        console.log('SUBACCOUNTS ', this.subAccounts);

    });
  }



  get(date) {
    var parts = date.split("/")
    return new Date(parts[2], parts[1] - 1, parts[0]).toISOString().substring(0,10);
  }


  getInvoiceById(id){

    this._accountservice.getInvoiceById(id).subscribe(res => {
      console.log('INVOCIE ', res);
      this.invoice = res;
      console.log('INVOICE TOTAL ', this.invoice.supplier);

     this.fillPoliza();
    });
  }

  fillPoliza(){
    this.subAccount =  this.subAccounts.find(res => res.subAccountNumber === this.invoice.supplier.subAccount);

    if(this.invoice.customer !== null) {
      console.log('SUPPLIER no EXISTER');
    } else{
      console.log('SUPPLIER ', this.invoice.supplier.company);
      this.date = new Date(this.invoice.fecha).toISOString().substring(0,10);
     let fol1:string = "Factura | "
     let fol: string = this.invoice.folio;
     let data2:string = this.invoice.concept;
     console.log('FOLIO ', this.invoice.folio);
    this.polizaForm.get('invoice.id').setValue(this.invoice.supplier.id);

     this.polizaForm.get('concept').setValue(fol1.concat(fol).concat(" ").concat(data2));
     this.itemsPolizas.controls[0].get('accountName').setValue(this.subAccount.cuentas.name);
     this.itemsPolizas.controls[0].get('accountNumber').setValue(this.subAccount.cuentas.account);

      this.itemsPolizas.controls[0].get('subAccountNumber').setValue(this.invoice.supplier.subAccount);
      this.itemsPolizas.controls[0].get('credit').setValue(this.invoice.total);
      this.itemsPolizas.controls[0].get('debit').setValue(0);
      this.itemsPolizas.controls[0].get('date').setValue(this.date);

      console.log('DATE ', this.date);

      this.polizaForm.get('date').setValue(this.date);
      this.polizaForm.get('type').setValue('Dr');
      console.log('FORM ', this.polizaForm.value);
      this.addItem();

      if(this.invoice.supplier.type.localeCompare("supply") ==0) {
        console.log('IS SUPPLIER');
        this.itemsPolizas.controls[1].get('accountName').setValue("Almacen");
        this.itemsPolizas.controls[1].get('accountNumber').setValue("100-09-00");
        this.itemsPolizas.controls[1].get('date').setValue(this.date);
        this.itemsPolizas.controls[1].get('subAccountName').setValue("Almacen de Materias primas");
         this.itemsPolizas.controls[1].get('subAccountNumber').setValue("1000901");
         this.itemsPolizas.controls[1].get('debit').setValue(this.invoice.subTotal);
         this.itemsPolizas.controls[1].get('credit').setValue(0);

         this.addItem();

         this.itemsPolizas.controls[2].get('accountName').setValue("IVA Acreditable");
        this.itemsPolizas.controls[2].get('accountNumber').setValue("100-10-00");
        this.itemsPolizas.controls[2].get('date').setValue(this.date);
        this.itemsPolizas.controls[2].get('subAccountName').setValue("IVA acreditable");
         this.itemsPolizas.controls[2].get('subAccountNumber').setValue("1001001");
         this.itemsPolizas.controls[2].get('debit').setValue(this.invoice.impuesto);
         this.itemsPolizas.controls[2].get('credit').setValue(0);
      }

    }


  }




}
