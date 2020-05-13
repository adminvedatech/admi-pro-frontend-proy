import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cuentas } from '../account.model';
import { AccountService } from '../account.service';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-add-subaccount',
  templateUrl: './add-subaccount.component.html',
  styleUrls: ['./add-subaccount.component.css']
})
export class AddSubaccountComponent implements OnInit {

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

  cuentas: Cuentas[] = [];
  arrs = ["Arr 2", "arr 4"];

  constructor(private accountservice: AccountService,
              private formBuilder: FormBuilder,
              private router: Router

              ) { }

  ngOnInit() {

    this.form = this.formBuilder.group({
      id: [''],
      cuentas:this.formBuilder.group({
        id:['', Validators.required],
      }),
      nameSubAccount: ['', Validators.required],
    subAccountNumber: ['', Validators.required],
    subAccountBalance: ['', Validators.required],
  //  status: ['']

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
        this.cuentas = res;
        console.log('Cuentas Contables ', this.cuentas);
        if(this.cuentas == null){
          Swal.fire({
            icon: "error",
            text: "No se tienen Cuentas de Contabilidad, envie el archivo de las Cuentas Contables",
            title: "Agregar Cuentas"
          });

          this.router.navigate(['/account/add-account']);
        }

    })

  }
}
