import { Component, OnInit } from "@angular/core";
import { FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { Product } from "src/app/production/Product.model";
import { ProductionService } from "src/app/production/production.service";
import { SupplierService } from "../supplier.service";
import { Supplier } from "../supplier.model";
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: "app-add-invoice-supplier",
  templateUrl: "./add-invoice-supplier.component.html",
  styleUrls: ["./add-invoice-supplier.component.css"]
})
export class AddInvoiceSupplierComponent implements OnInit {
  public form: FormGroup;
  public rawmaterials: FormArray;
  suppliers: Supplier[] = [];
  supplierSelect: Supplier;
  products: Product[] = [];
  totalCosto: number = 0;
  totalpzas: number = 0;

  production: {
    id: "";
    productName: "";
    code: "";
    batch: "";
    product: "";
    initialDate: "";
    finalDate: "";
    observation: "";
    quantity: "";
    cost: "";
    totalCost: "";
  };

  constructor(
    private fb: FormBuilder,
    private _supplierService: SupplierService,
    private _productionservice: ProductionService,
    private _globalService: GlobalService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [""],
      // productName: [''],
      supplier: this.fb.group({
        id: ["", Validators.required]
      }),
      concept:["", Validators.required],
      fecha: ["", Validators.required],
      fechaPago: [""],
      condicionesPago: [""],
      nombreArchivo: ["", [Validators.required]],
      subTotal: ["", Validators.required],
      impuesto: [""],
      total: ["", [Validators.required]],
      pago: [""],
      folio: [""],
      //   payment:[""],
      // rawMaterials: this.fb.array([])
      invoiceItems: this.fb.array([])
    });

    this.getAllSuppliers();
    this.getAllProducts();
    this.getInvoiceSupplier();
  }

  createRawMaterials(): FormGroup {
    return this.fb.group({
      id: [""],
      claveProdServ: [""],
      cantidad: [""],
      date: [""],
      unidad: [""],
      claveUnidad: [""],
      descripcion: [""],
      valorUnitario: [""],
      descuento: [""],
      importe: [""]
    });
  }

  removeMaterials(id: number) {
    this.materials.removeAt(id);
    // var arrayControl = this.form.get("materials") as FormArray;
    // for (var i = 0; i < arrayControl.length; i++) {
    //   this.raw[i] = <Raw>arrayControl.controls[i].value;
    // }
    this.itemsCalculation();
  }

  get materials(): FormArray {
    return this.form.get("invoiceItems") as FormArray;
  }

  addMaterials() {
    this.materials.push(this.createRawMaterials());
  }

  getAllSuppliers() {
    this._supplierService.getAllSuppliers().subscribe(res => {
      this.suppliers = res;
      console.log("SUPPLIERS ", this.suppliers);
    });
  }

  getAllProducts() {
    this._productionservice.getAllProducts().subscribe(res => {
      this.products = res;
      console.log("PRODUCTS ", this.products);
    });
  }

  selectCode(event) {
    console.log("SELECT CODE ", event);
    this.supplierSelect = this.suppliers.find(
      res => res.id === event.target.selectedIndex
    );
    console.log("RESULTADO ", this.supplierSelect);
    // this.form.get('code').setValue(resultado.code);
    //  this.form.get('product').setValue(resultado.productName);
  }

  selectedItem(event, id) {
    console.log("VALOR DE ID ", id);
    console.log("EVENT ", event);
    console.log("EVENT SELECTED INDEX ", event.target.value);
    console.log("EVENT SELECTED INDEX ", event.srcElement.selectedIndex);
    console.log("EVENT TARGET SELECTED INDEX ", event.target.selectedIndex);

    var cant = 10;
    const resultado = this.products.find(
      res => res.id === event.target.selectedIndex + 1
    );
    console.log("RESULTADO ", resultado);

    var arrayControl = this.form.get("invoiceItems") as FormArray;
    console.log("FORM CONTROL ", this.form.controls);
    console.log(
      "FORM RAWMATERIAL",
      this.form.controls.invoiceItems.value[id].descripcion
    );
    console.log(
      "FORM QUANTITY",
      this.form.controls.invoiceItems.value[id].cantidad
    );

    console.log("FORM DATA ");
    console.log("QUANTITY ", arrayControl.controls[id].value.cantidad);

    if (arrayControl.controls[id].value.cantidad > 0) {
      console.log("FORM ARRAY ", arrayControl.controls[id].value.descripcion);
      arrayControl.controls[id].get("claveUnidad").setValue(resultado.code);
      arrayControl.controls[id]
        .get("valorUnitario")
        .setValue(resultado.unitCost);
      arrayControl.controls[id]
        .get("importe")
        .setValue(
          arrayControl.controls[id].value.cantidad *
            arrayControl.controls[id].value.valorUnitario
        );

      // console.log('FORM ARRAY SET VALUE ', arrayControl.controls[id].get('quantity').setValue(2));
    } else {
      //   this.snackbar.fail('Agregar la cantidad utilizada de materia prima ');
      arrayControl.controls[id].get("invoiceItems").setValue("");
    }

    //  this.raw[id] = <Raw>arrayControl.controls[id].value;
    //  this.raw[id].costo = data.unitCost;
    //  this.raw[id].total = this.raw[id].quantity * this.raw[id].costo;
    //  arrayControl.controls[id].setValue(this.raw[id]);

    this.itemsCalculation();
  }

  recalculateCost() {
    var arrayControl = this.form.get("invoiceItems") as FormArray;
    if (arrayControl.length > 0) {
      this.itemsCalculation();
    }
  }

  itemsCalculation() {
    console.log("FORM ", this.form.controls.invoiceItems.value);
    var arrayControl = this.form.get("invoiceItems") as FormArray;
    //  if( this.form.get("quantity").value !== 0) {

    this.totalCosto = 0;
    for (var i = 0; i < arrayControl.length; i++) {
      this.totalCosto =
        this.totalCosto + arrayControl.controls[i].value.importe;
      // arrayControl.controls[i].get("date").setValue(this.form.get("fecha").value);
    }
    this.form.get("subTotal").setValue(this.totalCosto);
    // this.totalpzas = this.form.get("quantity").value;
    if (this.supplierSelect.isTax) {
      console.log("HEY THERE IS TAXES");

      this.form.get("total").setValue(this.totalCosto * 1.16);
      this.form.get("impuesto").setValue(this.totalCosto * 0.16);

      // this.form.get('impuesto').setValue((this.totalCosto*16)/100);
      //  this.totalCosto = this.totalCosto*1.16;
    } else {
      console.log("NO TAXES", this.supplierSelect.isTax);
      this.form.get("total").setValue(this.totalCosto);
    }

    //  this.form.get("cost").setValue(this.totalCosto / this.totalpzas);
    // } else {
    console.log("AGREGE LA CANTIDAD A PRODUCIR");
  }

  inputChange(event: any, id) {
    console.log("I ", id);
    var arrayControl = this.form.get("invoiceItems") as FormArray;
    if (arrayControl.controls[id].value.valorUnitario > 0) {
      arrayControl.controls[id]
        .get("importe")
        .setValue(
          arrayControl.controls[id].value.cantidad *
            arrayControl.controls[id].value.valorUnitario
        );
      this.itemsCalculation();
    }
  }

  onSubmit() {
    console.log("FORM ", this.form);

    let myDate = this.formDate(this.form.get('fecha').value);
    //   let myDate = this._wharehouseService.formatDate(this.form.get('fecha').value);
       this.form.get('fecha').setValue(myDate);
    let myFechaPago = this.formDate(this.form.get('fechaPago').value);
    this.form.get('fechaPago').setValue(myFechaPago);

    var arrayControl = this.form.get("invoiceItems") as FormArray;
    for (let i = 0; i< arrayControl.length; i ++){

      arrayControl.controls[i].get('date').setValue(this.form.get('fecha').value);
    }


    let resource = JSON.stringify(this.form.value);
    this._supplierService.addInvoiceSupplier(resource).subscribe(res => {
      console.log("AGREGAR INVOICE ", res);

      this.cleanForm();
    });
    // this.productionservice.addProduction(resource).subscribe(res=> {
  }

  cleanForm() {
  //  this.form.get("initialDate").setValue("");
    this.form.reset();
    //  console.log('ARRAY LENGHT', this.materials.length);
  }



  formDate(date) {
    console.log('VALOR DE NEW DATE ', new Date(2020,0,1));
    var parts = date.split("-")
   // console.log('PARTS ', parts);
    return new Date(parts[0], parts[1] - 1, parts[2])

  }

  getInvoiceSupplier(){

    this._supplierService.getInvoiceSuppliers().subscribe(res=> {
      console.log('INVOICE ', res);

    });
  }



}
