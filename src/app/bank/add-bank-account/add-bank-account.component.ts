import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Supplier } from 'src/app/supplier/supplier.model';
import { Product } from 'src/app/production/Product.model';
import { SupplierService } from 'src/app/supplier/supplier.service';
import { ProductionService } from 'src/app/production/production.service';
import { GlobalService } from 'src/app/services/global.service';
import Swal from "sweetalert2";
import { ActivatedRoute, Router } from '@angular/router';
import { BankService } from '../bank.service';
import { Bank } from '../bank.model';
import { AccountService } from 'src/app/account/account.service';
import { SubAccount } from 'src/app/account/account.model';

@Component({
  selector: 'app-add-bank-account',
  templateUrl: './add-bank-account.component.html',
  styleUrls: ['./add-bank-account.component.css']
})
export class AddBankAccountComponent implements OnInit {

  subAccounts:SubAccount[]=[];
  acc:any[]=[];

  public form: FormGroup;
  id: string = "";
  sup = "";
  bank: Bank;
  supplierClean = {
    id: "",
    bankName: "",
    bankAccount: "",
    nameSubAcc: "",
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

  ngOnInit() {

      this.form = this.fb.group({
      id: [""],
      // productName: [''],
      bank: this.fb.group({
        id: ['', Validators.required]
      }),
      bankName: ["", [Validators.required]],
      bankAccount: ["", Validators.required],
      nameSubAcc:[""],
      initialBalance: [""],
      balance: [""],

    });

    console.log('IS VALID ', this.form);
    this.getAccountService();

    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id != null) {
      console.log("HAY PARAMETRO", this.id);
      this.getSupplierById();

    } else {
      console.log("NO HAY PARAMETRO ", this.id);
    }



  }

  addSupplier(bank: Bank) {
    this._bankService.addBank(bank).subscribe(res => {
      console.log(res);
      this.bank = res.body;
      console.log("SUPPLIER ", this.bank);
    });
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
        this.router.navigate(['/supplier/supplier-list']);
    } else {
      this._bankService.addBank(this.form.value).subscribe(res => {
        Swal.fire({
          icon: "success",
          text: "Se agrego el Proveedor",
          title: "Proceso exitoso"
        });
      });
    }
    this.cleanForm();
  }

  cleanForm() {
    this.form.setValue(this.supplierClean);
  }

  selectAccount(){
    this.getAccountService();
  }

  getSupplierById() {
    this._bankService.getBankById(this.id).subscribe(res => {
      console.log("SUPPLIER ", res);
      this.bank = res;
      this.form.setValue(this.bank);
    });
  }

  getAccountService(){
    this._accountService.getAllSubAccounts().subscribe(res => {
      this.subAccounts=res;
      console.log('SUBACCOUNT ', this.subAccounts);


    });
  }

  onUpdate() {
    console.log("UPDATE");
  }

}
