import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { BankTransaction } from '../../bank/bank.model';
// import { BankService } from '../../services/bank.service';
import { BankService } from '../../bank/bank.service';
import { SubAccount } from '../account.model';
import { AccountService } from '../account.service';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd, RoutesRecognized } from '@angular/router';
import { Event as NavigationEvent } from "@angular/router";
import { Bank, BankMovementRegister } from 'src/app/bank/bank.model';
import Swal from "sweetalert2";
import { map, filter, pairwise } from 'rxjs/operators';
import { BankMovementRegisterComponent } from 'src/app/bank/bank-movement-register/bank-movement-register.component';
import { PolizaService } from '../poliza.service';
import { stringify } from 'querystring';
import { InvoiceService } from 'src/app/invoice/invoice.service';
import { PolizaInvoiceService } from '../poliza-invoice.service';


@Component({
  selector: 'app-add-accounting-policy',
  templateUrl: './add-accounting-policy.component.html',
  styleUrls: ['./add-accounting-policy.component.css']
})
export class AddAccountingPolicyComponent implements OnInit {

  orderForm: FormGroup;
  itemsPolizas: FormArray;
  item: FormGroup;
  subAccounts: SubAccount[] = [];
  subAccount:SubAccount;
  bankTransactions: [] = [];
  bankMovementRegister: any;
  modelBankMovementReg: BankMovementRegister;
  bank: Bank;
  index: number;
  id: string="";
  previousUrl: string="";
  url:string="";


  bankMovement= {
    id: "",
    codTransac: "",
    cuenta: "",
    depositos: "",
    descripcion: "",
    descripcionDetallada:"",
    enabled: false,
    fecha:"",
    fechaOperacion:"",
    movimiento:"",
    referencia:"",
    retiros:"",
    saldo: "",
    sucursal:"",
    poliza: {

      id: "",
      type: "",
      concept:"",
      date: "",
      polizaNum:"",
      itemsPoliza: "",
    }
  }

  poliza = {
    id: "",
    type: "",
    concept:"",
    date: "",
    itemsPolizas:[],
  }

  sumDebit=0;
  sumCredit=0;
  difSum=0;

  constructor(public polizaservice: PolizaService,
              private formBuilder: FormBuilder,
              private accountservice: AccountService,
              private _bankservice: BankService,
              private _invoicesupplier: InvoiceService,
              private _polizainvoiceservice: PolizaInvoiceService,
              private route: ActivatedRoute,
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
          this.polizaservice.clearPoliza();

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

    this.index = 0;
	}




  ngOnInit() {

    let {params} = this.route.snapshot;
    this.url = `${params.id2}`;
    this.id = `${params.id}`;

     this.polizaservice.orderForm;
    switch(this.url){
      case 'br': this.polizaservice.getBankMovementRegisterById(this.id);
      break;
      case 'csv': this.polizaservice.getBankMovementCsvById(this.id);
      this.polizaservice.addItem();
      break;
      case 'is': this._polizainvoiceservice.getSupplierInvoiceById(this.id);
        break;
     // default: this.getBankMovementCsvById(this.id);
    }
    this.polizaservice.getAllSubAccount();
  }


  addValue(event) {
   this.index =  event.target.selectedIndex;
   this.itemsPolizas.controls[0].get('debit').setValue(0);
  }



  getBankMovementRegisterById(id){
       this._bankservice.getBankMovementRegisterById(id).subscribe(res =>{
       this.modelBankMovementReg = res;
       let formdata = JSON.stringify(this.modelBankMovementReg);
       this.poliza = this.modelBankMovementReg.poliza;
    //   let date = this.polizaservice.orderForm.get('date').setValue(this.getDate(this.modelBankMovementReg.fecha));
       this.polizaservice.orderForm.get('type').setValue(this.modelBankMovementReg.poliza.type);
     //  this.polizaservice.orderForm.get('polizaNumber').setValue(this.modelBankMovementReg.poliza.polizaNumber);
       this.polizaservice.orderForm.get('concept').setValue(this.modelBankMovementReg.poliza.concept);
       this.polizaservice.orderForm.get('id').setValue(res.id);
      for(let i=0; i < res.poliza.itemsPolizas.length; i++){
       // this.addItem();
        this.item.setValue(res.poliza.itemsPolizas[i]);
        this.itemsPolizas.push(this.item);
     //   this.removeItem(i);
      }
    })
  }

  getInvoiceSupplierById(id){

    this._invoicesupplier.getInvoiceSupplierById(id).subscribe(res=> {
      console.log(res);

    })
  }

  onSubmit() {

    if(this.polizaservice.verifySumPolizas()){
        console.log('Result is True', this.polizaservice.verifySumPolizas());
        this.createPoliza();

    }

  }

  createPoliza(){

    // let data = JSON.stringify(this.polizaservice.bankMovementRegister);

    // this.bankMovement = this.polizaservice.bankMovementRegister;
  // let data2 = this.polizaservice.orderForm.value;
  // this.bankMovement.poliza = data2;
  // let data3 = JSON.stringify(this.bankMovement);


// Se manda al Servidor
  // this.accountservice.createPoliza(data3).subscribe(res => {
  //   console.log('RES ', res);

    // this.polizaservice.clearPoliza();
    // Swal.fire({
    //   icon: "success",
    //   text: "Se agrego la Poliza a la Base de Datos con exito",
    //   title: "Agregar Poliza"
    // });

    console.log('URL', this.url);
    switch(this.url){

      case 'br':
      console.log('br');
      this.polizaservice.sendData();
      this.router.navigateByUrl('/bank/bank-movement-register');
      break;
      case 'csv':
      this.polizaservice.sendData();
      this.router.navigateByUrl('/bank/add-file-bankmovement');
      console.log('CSV BANK');
      break;
      case 'is':
        this._polizainvoiceservice.sendData();
        this.router.navigateByUrl('/invoice/invoice-supplier-list');
        console.log('INVOICE SUPPLIER');
        break;
     // default: this.getBankMovementCsvById(this.id);
    }


  // });

  }


}
