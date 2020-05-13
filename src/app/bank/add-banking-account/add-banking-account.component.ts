import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/account/account.service';
import { SubAccount } from 'src/app/account/account.model';
import { BankService } from '../bank.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Bank } from '../bank.model';

@Component({
  selector: 'app-add-banking-account',
  templateUrl: './add-banking-account.component.html',
  styleUrls: ['./add-banking-account.component.css']
})
export class AddBankingAccountComponent implements OnInit {

  form:FormGroup;
  subAccounts: SubAccount[]=[];

  id: string = null;
  sup = "";
  bank: Bank;
  supplierClean = {
    id: "",
    bankName: "",
    bankAccount: "",
    nameSubAcc: "",
    subAccount:"",
    initialBalance: "",
    balance: "",
  };


  constructor(
    private _bankService: BankService,
    private _accountService: AccountService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  ngOnInit(): void {

    this.form = this.fb.group({
      id:[''],
      bankName:['', Validators.required],
      bankAccount:['', Validators.required],
      subAccount: ['', Validators.required],
      initialBalance:['',Validators.required],
      balance:['',Validators.required]
    });

    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id != null) {
      console.log("HAY PARAMETRO", this.id);
      this.getBankingAccountById();
    } else {
      console.log("NO HAY PARAMETRO ", this.id);
    }

    this.getAllSubAccounts();
  }

  onSubmit() {

    if (this.id != null) {
      this._bankService
        .updateBank(this.form.value)
        .subscribe(res => {
          Swal.fire({
            icon: "success",
            text: "Se actualilzo el Proveedor",
            title: "Proceso exitoso"
          });
        });
        this.router.navigate(['/bank/banking-account-list']);
    } else {
      this._bankService.addBank(this.form.value).subscribe(res => {
        Swal.fire({
          icon: "success",
          text: "Se agrego la Cuenta en la Base de Datos",
          title: "Proceso exitoso"
        });
      });
    }
    this.cleanForm();
  }

  getAllSubAccounts(){
    this._accountService.getAllSubAccounts().subscribe( res=>{
      console.log('SUBACCOUNTS 2', this.subAccounts);

        this.subAccounts = res;
      if(this.subAccounts == null){
        Swal.fire({
          icon: "error",
          text: "No se tienen Subcuentas de Contabilidad",
          title: "Agregar Subcuentas"
        });

        this.router.navigate(['/account/add-subaccount']);
      }

    },(err)=>{
      console.log('ERROR', err);

    }
    )
  }

  cleanForm() {
    this.form.setValue(this.supplierClean);
  }

  addInitialBalance(event){
    const resultado = this.subAccounts.find( res => res.id === event.target.selectedIndex);
    console.log('ADD INITIAL BALANCE', resultado);
    this.form.get('initialBalance').setValue(resultado.subAccountBalance);
    this.form.get('balance').setValue(resultado.subAccountBalance);
    this.form.get('bankName').setValue(resultado.nameSubAccount);


  }


  getBankingAccountById(){
    this._bankService.getBankById(this.id).subscribe(res =>{
        this.bank = res;
        console.log('BANK ', this.bank);
        if(this.bank.initialBalance !== this.bank.balance){
          console.log('HAY DIFERENCIAS ENTRE LOS BALANCES');
          Swal.fire({
            icon: "error",
            text: "La Cuenta tiene Movimientos, no se pueden alterar los datos de la Cuenta",
            title: "No se puede Editar"
          });
          this.router.navigate(["/bank/banking-account-list"]);
        }else {
          console.log('NO HAY DIFERENCIAS');

        }



        this.form.setValue(this.bank);
    })
  }

}
