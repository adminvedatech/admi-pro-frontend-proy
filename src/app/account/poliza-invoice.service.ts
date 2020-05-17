import { Injectable } from '@angular/core';
import { InvoiceService } from '../invoice/invoice.service';
import { Invoice } from '../invoice/invoice.model';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { GlobalService } from '../services/global.service';
import { PolizaService } from './poliza.service';
import { AccountService } from './account.service';
import { SubAccount } from './account.model';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Event as NavigationEvent, RoutesRecognized } from "@angular/router";
import { URL_SERVICIOS } from '../auth/url/url';
import { NavigationStart, Router } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import Swal from "sweetalert2";


@Injectable({
  providedIn: 'root'
})
export class PolizaInvoiceService {

  itemsPolizas:FormArray;
  invoice: Invoice;
  item: FormGroup;
  date: any;
  subAccount: any;
  counter: number = 0;
  private httpHeaders = new HttpHeaders();
  subAccountNumber="api/contabilidad/get-subaccount-by-number";
  previousUrl: string="";



  constructor(public formBuilder: FormBuilder,
    public _invoiceservice: InvoiceService,
    public _globalservice: GlobalService,
    public _polizaservice: PolizaService,
    public _accountservice: AccountService,
    private http: HttpClient,
    private router: Router
    ) {


      router.events
			.pipe(
				// The "events" stream contains all the navigation events. For this demo,
				// though, we only care about the NavigationStart event as it contains
				// information about what initiated the navigation sequence.
				filter(
					( event: NavigationEvent ) => {

						return( event instanceof NavigationStart );

					}
        )

			)
			.subscribe(

				( event: NavigationStart ) => {

					 console.group( "NavigationStart Event" );
					// Every navigation sequence is given a unique ID. Even "popstate"
					// navigations are really just "roll forward" navigations that get
          // a new, unique ID.
          this._polizaservice.clearPoliza();

				//  console.log( "navigation id:", event.id );
				//  console.log( "route:", event.url );
					// The "navigationTrigger" will be one of:
					// --
					// - imperative (ie, user clicked a link).
					// - popstate (ie, browser controlled change such as Back button).
					// - hashchange
					// --
					// NOTE: I am not sure what triggers the "hashchange" type.
				//  console.log( "trigger:", event.navigationTrigger );

					// This "restoredState" property is defined when the navigation
					// event is triggered by a "popstate" event (ex, back / forward
					// buttons). It will contain the ID of the earlier navigation event
					// to which the browser is returning.
					// --
					// CAUTION: This ID may not be part of the current page rendering.
					// This value is pulled out of the browser; and, may exist across
					// page refreshes.
					if ( event.restoredState ) {

						console.warn(
							"restoring navigation id:",
							event.restoredState.navigationId
						);

					}

					console.groupEnd();

				}

      );

      this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        console.log('previous url', events[0].urlAfterRedirects);
        this.previousUrl = events[0].urlAfterRedirects;
        console.log('PREVIOS IS ', this.previousUrl);

        console.log('current url', events[1].urlAfterRedirects);
      });


    }








  // SE BUSCA EL MOVIMIENTO BANCARIO POR ID, SE AGREGA CONCEPTO, FECHA Y SE MANDA VERIFICAR EL TIPO DE POLIZA "Eg" o "Ig"
  getSupplierInvoiceById(id:any){
   // this._polizaservice.addItem();
    this._invoiceservice.getInvoiceSupplierById(id).subscribe(res=>{
      this.invoice = res;
      console.log('BANK MOVEMENT CSV IN SERVICE', this.invoice);

      // this.orderForm.get('concept').setValue(this.bankMovementRegister.descripcionDetallada); /* Se agrega concepto a la poliza */
      // let date = this.getDate(this.bankMovementRegister.fechaOperacion);                      /* Se agrega fecha a la poliza */
      // this.orderForm.get('date').setValue(date);
      this.selectPolizaType();                                                                /* Selecciona el Tipo de Poliza Eg Ig */
    });

  }

   /* Se Seleccciona que tipo de Poliza si es de Eg o Ig se agrega el ItemPoliza 0 se agrega en el Debito o Credito */
   selectPolizaType(){
    this._polizaservice.orderForm.get('concept').setValue(this.invoice.concept); /* Se agrega concepto a la poliza */
    this.itemsPolizas = this._polizaservice.orderForm.get('itemsPolizas') as FormArray;
    // this.date = new Date(this.invoice.fecha).toString;
   //   this.date = this.getDate(this.invoice.fecha);   /* Se agrega fecha a la poliza */
      this.date = new Date(this.invoice.fecha).toISOString().substring(0,10);                                                                      /* Se agrega fecha a la poliza */
      this._polizaservice.orderForm.get('date').setValue(this.date);
      this._polizaservice.orderForm.get('type').setValue('Dr');

      this._polizaservice.addItem();
      this.getAccountByNumber(this.invoice.supplier.subAccount);
      console.log('SUBACCOUNT 1', this.subAccount);

      // this.itemsPolizas.controls[0].get('credit').setValue(this.invoice.total);
      // this.itemsPolizas.controls[0].get('debit').setValue(0);
      // // this._polizaservice.orderForm.get('date').setValue(this.date);
      // this.itemsPolizas.controls[0].get('accountName').setValue(this.subAccount.cuentas.name);
      // this.itemsPolizas.controls[0].get('accountNumber').setValue(this.subAccount.cuentas.account);
      // this.itemsPolizas.controls[0].get('subAccountName').setValue(this.subAccount.nameSubAccount);
      // this.itemsPolizas.controls[0].get('subAccountNumber').setValue(this.subAccount.subAccountNumber);
      // this.itemsPolizas.controls[0].get('date').setValue(this.date);


      this._polizaservice.addItem();
      this.getAccountByNumber("1001001");
      console.log('SUBACCOUNT 2', this.subAccount);
      // this.itemsPolizas.controls[1].get('debit').setValue(this.invoice.impuesto);
      // this.itemsPolizas.controls[1].get('credit').setValue(0);
      // // this._polizaservice.orderForm.get('date').setValue(this.date);
      // this.itemsPolizas.controls[1].get('accountName').setValue(this.subAccount.cuentas.name);
      // this.itemsPolizas.controls[1].get('accountNumber').setValue(this.subAccount.cuentas.account);
      // this.itemsPolizas.controls[1].get('subAccountName').setValue(this.subAccount.nameSubAccount);
      // this.itemsPolizas.controls[1].get('subAccountNumber').setValue(this.subAccount.subAccountNumber);
      // this.itemsPolizas.controls[1].get('date').setValue(this.date);

      this._polizaservice.addItem();
      this.getAccountByNumber("1000901");
      console.log('SUBACCOUNT 2', this.subAccount);
      // this.itemsPolizas.controls[2].get('debit').setValue(this.invoice.subTotal);
      // this.itemsPolizas.controls[2].get('credit').setValue(0);
      // // this._polizaservice.orderForm.get('date').setValue(this.date);
      // this.itemsPolizas.controls[2].get('accountName').setValue("Almacen");
      // this.itemsPolizas.controls[2].get('accountNumber').setValue("1000900");
      // this.itemsPolizas.controls[2].get('subAccountName').setValue("ALMACEN DE MATERIAS PRIMAS");
      // this.itemsPolizas.controls[2].get('subAccountNumber').setValue("1000901");
      // this.itemsPolizas.controls[2].get('date').setValue(this.date);

    console.log('FORM ', this._polizaservice.orderForm.value);


    // this.itemsPolizas.controls[0].get('date').setValue(this.date);
   }

   getAccountByNumber(num: any){

    this._accountservice.getSubAccountBySubAccountNumber(num).subscribe(res => {
      this.subAccount = res;
      this.fillItemsPoliza();
    });

      this.counter = 0;
  }

  fillItemsPoliza(){
 if(this.invoice.supplier != null && this.counter == 0){
  this._polizaservice.compareNumber = this.invoice.total;
  this.itemsPolizas.controls[this.counter].get('credit').setValue(this.invoice.total);
  this.itemsPolizas.controls[this.counter].get('debit').setValue(0);
 }else if(this.invoice.supplier != null && this.subAccount.cuentas.id == 10) {
  this.itemsPolizas.controls[this.counter].get('debit').setValue(this.invoice.impuesto);
  this.itemsPolizas.controls[this.counter].get('credit').setValue(0);

 }else {
  this.itemsPolizas.controls[this.counter].get('debit').setValue(this.invoice.subTotal);
  this.itemsPolizas.controls[this.counter].get('credit').setValue(0);

 }

    // this._polizaservice.orderForm.get('date').setValue(this.date);
    this.itemsPolizas.controls[this.counter].get('accountName').setValue(this.subAccount.cuentas.name);
    this.itemsPolizas.controls[this.counter].get('accountNumber').setValue(this.subAccount.cuentas.account);
    this.itemsPolizas.controls[this.counter].get('subAccountName').setValue(this.subAccount.nameSubAccount);
    this.itemsPolizas.controls[this.counter].get('subAccountNumber').setValue(this.subAccount.subAccountNumber);
    this.itemsPolizas.controls[this.counter].get('date').setValue(this.date);
    this.counter = this.counter +1;
    console.log('FORM ', this._polizaservice.orderForm.value);
  }




   getDate(date) {
    var parts = date.split("/")
    return new Date(parts[2], parts[1] - 1, parts[0]).toISOString().substring(0,10);
  }

  sendData(){
    let data2 = this._polizaservice.orderForm.value;
    this.invoice.poliza = data2;
    let data3 = JSON.stringify(this.invoice);
    console.log('DATA 3 ', data3);


    // Se manda al Servidor
  this._accountservice.createInvoicePoliza(data3).subscribe(res => {
    console.log('RES ', res);

    this._polizaservice.clearPoliza();
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
