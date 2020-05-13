import { Component, OnInit } from "@angular/core";
import { SupplierService } from "../supplier.service";
import { Supplier } from "../supplier.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { HttpResponse } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { SubAccount } from 'src/app/account/account.model';
import { AccountService } from 'src/app/account/account.service';
@Component({
  selector: "app-add-supplier",
  templateUrl: "./add-supplier.component.html",
  styleUrls: ["./add-supplier.component.css"]
})
export class AddSupplierComponent implements OnInit {

  form: FormGroup;
  id: string = "";
  sup = "";
  supplier: Supplier;
  subAccounts: SubAccount[]=[];

  supplierClean = {
    id: "",
    company: "",
    supplierRfc: "",
    subAccount:"",
    creditDays: "",
    address: "",
    initialBalance: "",
    balance: "",
    isTax: false,
    isActive: false
  };

  constructor(
    private _serviceSupplier: SupplierService,
    private _accountService: AccountService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [""],
      // productName: [''],
      company: ["", [Validators.required]],
      nameAccount:[""],
      accountNumber:[""],
      nameSubAccount: [""],
      subAccount: ["", Validators.required],
      supplierRfc: ["", Validators.required],
      creditDays: [""],
      address: [""],
      initialBalance: [""],
      balance: [""],
      isTax: [''],
      isActive: [''],
      type:[''],

    });

    console.log('IS VALID ', this.form);


    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id != null) {
      console.log("HAY PARAMETRO", this.id);
      this.getSupplierById();
    } else {
      console.log("NO HAY PARAMETRO ", this.id);
    }

    this.getSubAccount();
  }

  addSupplier(supplier: Supplier) {
    this._serviceSupplier.addSupplier(supplier).subscribe(res => {
      console.log(res);
      this.supplier = res.body;
      console.log("SUPPLIER ", this.supplier);
    });
  }

  onSubmit() {
      console.log('FORM ', this.form.value);

    if (this.id != null) {
      this._serviceSupplier
        .updateSupplier(this.form.value)
        .subscribe(res => {
          Swal.fire({
            icon: "success",
            text: "Se actualilzo el Proveedor",
            title: "Proceso exitoso"
          });
        });
        this.cleanForm();
        this.router.navigate(['/supplier/supplier-list']);
    } else {
      this._serviceSupplier.addSupplier(this.form.value).subscribe(res => {
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

  getSupplierById() {
    this._serviceSupplier.getSupplierById(this.id).subscribe(res => {
      console.log("SUPPLIER ", res);
      this.supplier = res;
      this.form.setValue(this.supplier);
    });
  }

  onUpdate() {
    console.log("UPDATE");
  }

  getSubAccount(){

    this._accountService.getAllSubAccounts().subscribe( res=>{

      this.subAccounts = res;
      console.log('SUBACCOUNTS 2', this.subAccounts);
      if(this.subAccounts == null){
        Swal.fire({
          icon: "error",
          text: "No se tienen Subcuentas de Contabilidad",
          title: "Agregar Subcuentas"
        });

        this.router.navigate(['/account/add-subaccount']);
      }

   //   this.form.get('accountName').setValue();

    },(err)=>{
      console.log('ERROR', err);
    });
  }


  addInitialBalance(event){
    const resultado = this.subAccounts.find( res => res.id === event.target.selectedIndex);
    console.log('ADD INITIAL BALANCE', resultado);
    this.form.get('initialBalance').setValue(resultado.subAccountBalance);
    this.form.get('balance').setValue(resultado.subAccountBalance);
    this.form.get('company').setValue(resultado.nameSubAccount);


  }

  }
