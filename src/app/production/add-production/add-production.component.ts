import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ProductionService } from '../production.service';
import { Product } from '../Product.model';

@Component({
  selector: 'app-add-production',
  templateUrl: './add-production.component.html',
  styleUrls: ['./add-production.component.css']
})
export class AddProductionComponent implements OnInit {

  public form: FormGroup;
  public rawmaterials: FormArray;
  products: Product[] = [];
  totalCosto: number = 0;
  totalpzas: number = 0;

  production: {
    'id':'',
    'productName':'',
    'code':'',
    'batch':'',
    'product':'',
    'initialDate':'',
    'finalDate':'',
    'observation':'',
    'quantity':'',
    'cost':'',
    'totalCost':''

  }

  constructor(private fb: FormBuilder,
              private productionservice: ProductionService,
    ) { }

  ngOnInit() {

    this.form = this.fb.group({
      id: [""],
      // productName: [''],
      productName: this.fb.group({

        id: ['', Validators.required]
      }),
      batch: ['', Validators.required],
      code: [''],
      product: [''],
      initialDate: ["", [Validators.required]],
      finalDate: ["", Validators.required],
      observation: [""],
      quantity: ["", [Validators.required]],
      cost: [""],
      totalCost: [""],
      rawMaterials: this.fb.array([])
    });

    this.getAllProducts();

  }

  createRawMaterials(): FormGroup {
    return this.fb.group({
      id: [''],
      codeProduct: [''],
      quantity: [''],
      rawmaterial:[''],
      unitCost: [''],
      total: ['']
    })
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
    return this.form.get("rawMaterials") as FormArray;
  }

  addMaterials() {
    this.materials.push(this.createRawMaterials());
  }

  getAllProducts() {
    this.productionservice.getAllProducts().subscribe(res => {
      this.products = res;
      console.log("PRODUCTS ", this.products);

    });
  }


  selectCode(event){

    console.log('SELECT CODE ', event );
    const resultado = this.products.find( res => res.id === event.target.selectedIndex);
    console.log('RESULTADO ', resultado);
    this.form.get('code').setValue(resultado.code);
    this.form.get('product').setValue(resultado.productName);

  }

  selectedItem(event, data, id) {
    console.log('VALOR DE ID ', id);
    console.log('EVENT ', event);
    console.log('EVENT SELECTED INDEX ', event.target.value);
    console.log('EVENT SELECTED INDEX ', event.srcElement.selectedIndex);
    console.log('EVENT TARGET SELECTED INDEX ', event.target.selectedIndex);



    var cant = 10;
    const resultado = this.products.find( res => res.id === event.target.selectedIndex+1);
    console.log('RESULTADO ', resultado);


    var arrayControl = this.form.get("rawMaterials") as FormArray;
      console.log('FORM CONTROL ', this.form.controls);
      console.log('FORM RAWMATERIAL', this.form.controls.rawMaterials.value[id].rawmaterial);
      console.log('FORM QUANTITY', this.form.controls.rawMaterials.value[id].quantity);

      console.log('FORM DATA ', data);
      console.log('QUANTITY ', arrayControl.controls[id].value.quantity);

      if(arrayControl.controls[id].value.quantity > 0) {
        console.log('FORM ARRAY ', arrayControl.controls[id].value.rawmaterial);
        arrayControl.controls[id].get('codeProduct').setValue(resultado.code);
       arrayControl.controls[id].get('unitCost').setValue(resultado.unitCost);
        arrayControl.controls[id].get('total').setValue(arrayControl.controls[id].value.quantity *
          arrayControl.controls[id].value.unitCost);

        // console.log('FORM ARRAY SET VALUE ', arrayControl.controls[id].get('quantity').setValue(2));
      }else {

     //   this.snackbar.fail('Agregar la cantidad utilizada de materia prima ');
        arrayControl.controls[id].get('rawmaterials').setValue('');
      }

    //  this.raw[id] = <Raw>arrayControl.controls[id].value;
    //  this.raw[id].costo = data.unitCost;
    //  this.raw[id].total = this.raw[id].quantity * this.raw[id].costo;
    //  arrayControl.controls[id].setValue(this.raw[id]);

     this.itemsCalculation();
  }

  recalculateCost() {
    var arrayControl = this.form.get("rawMaterials") as FormArray;
    if (arrayControl.length > 0) {
      this.itemsCalculation();
    }
  }


  itemsCalculation() {
    console.log('FORM ', this.form.controls.rawMaterials.value);
    var arrayControl = this.form.get("rawMaterials") as FormArray;
    if( this.form.get("quantity").value !== 0) {

      this.totalCosto = 0;
      for (var i = 0; i < arrayControl.length; i++) {

        this.totalCosto = this.totalCosto + arrayControl.controls[i].value.total;

      }
      this.totalpzas = this.form.get("quantity").value;
      this.form.get("totalCost").setValue(this.totalCosto);
      this.form.get("cost").setValue(this.totalCosto / this.totalpzas);
    } else {
    console.log('AGREGE LA CANTIDAD A PRODUCIR');

    }
  }

  inputChange(event: any, id) {


    console.log('I ',id);
    var arrayControl = this.form.get("rawMaterials") as FormArray;
    if(arrayControl.controls[id].value.unitCost > 0 ) {

            arrayControl.controls[id].get('total').setValue(arrayControl.controls[id].value.quantity *
              arrayControl.controls[id].value.unitCost);
              this.itemsCalculation();
    }

  }




  onSubmit(){
    console.log('FORM ', this.form);
    let myDate = this.getDate(this.form.get('initialDate').value);
    this.form.get('initialDate').setValue(myDate);
   // this.form.get('initialDate').setValue(this.getDate(date.target.value));
    console.log('FORM ', this.form);

    let myDate2 = this.getDate(this.form.get('finalDate').value);
    this.form.get('finalDate').setValue(myDate2);
   // this.form.get('initialDate').setValue(this.getDate(date.target.value));
    console.log('FORM ', this.form);


    let resource = JSON.stringify(this.form.value);
    this.productionservice.addProduction(resource).subscribe(res=> {
      console.log('production ', res);
      this.cleanForm();

    });



  }

  cleanForm(){
    this.form.get('initialDate').setValue('');
    this.form.reset();
  //  console.log('ARRAY LENGHT', this.materials.length);

  }

  formatInitialDate() {


   }

   formatFinalDate() {

   }

    getDate(date) {

      var parts = date.split("-")
      console.log('PARTS ', parts);
      return new Date(parts[0], parts[1] - 1, parts[2])

    }


}
