import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SubAccount, AccountType, Cuentas } from '../account.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-subaccount',
  templateUrl: './subaccount.component.html',
  styleUrls: ['./subaccount.component.css']
})
export class SubaccountComponent implements OnInit {

  form: FormGroup;
  // // subaccount: SubAccount = {
  // //   id: null,
  // //   nameAccount: '',
  // //   accountNumber: '',
  // //   balance: null,
  // //   status: false,
  // //   accountType = {
  // //     id: null,
  // //     name: '',
  // //     account: '',
  // //     balance: null,
  // //     state: false,
  // //     subaccount:SubAccount

  // //   }

  // }

  accounts: Cuentas[] = [];
  arrs = ["Arr 2", "arr 4"];

  constructor(private accountservice: AccountService,
              private formBuilder: FormBuilder

              ) { }

  ngOnInit() {

    this.form = this.formBuilder.group({
      id: [''],
      accountType:this.formBuilder.group({
        id:['', Validators.required],
      }),
      nameAccount: ['', Validators.required],
    accountNumber: ['', Validators.required],
    balance: ['', Validators.required],
    status: ['']

    });

    console.log('FORM VALUE ', this.form);


    this.getAllAccountTye();

  }

  onSubmit(){
    console.log('FORM ',this.form);
    // this.submitted = true;

    if(this.form.valid) {

      this.accountservice.createSubAccount(this.form.value).subscribe(res=> {
        console.log('RESW ', res);
        this.cleanForm();
        Swal.fire({
          icon: 'success',
          title: 'Proceso',
          text: 'Transaccion con exito!',
          // footer: '<a href>Why do I have this issue?</a>'
        })

      })

    } else {

      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Llene el formulario con los datos requeridos!',
        // footer: '<a href>Why do I have this issue?</a>'
      })

    }
  }

  cleanForm() {
    // this.form.setValue(this.subaccount);
    //  this.router.navigate(['/bank/bank-list']);

  }

  getAllAccountTye() {

    this.accountservice.getAllAccounts().subscribe(res => {
        this.accounts = res;
        console.log('EN SUBACCOUNT ', this.accounts);

    })

  }

}
