import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Product } from '../../production/Product.model';
import { ProductionService } from '../../production/production.service';
import { WharehouseService } from '../wharehouse.service';
import { GlobalService } from 'src/app/services/global.service';
import { formatDate } from '@fullcalendar/core'



@Component({
  selector: 'app-add-movement-wharehouse',
  templateUrl: './add-movement-wharehouse.component.html',
  styleUrls: ['./add-movement-wharehouse.component.css']
})
export class AddMovementWharehouseComponent implements OnInit {


  public form: FormGroup;
  products: Product[] = [];
  product: Product;
  totalCosto: number = 0;
  totalpzas: number = 0;
  entrada: Boolean = true;
 // quantity: number = 0;

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
              private _wharehouseService: WharehouseService,
              private _globalServices: GlobalService
    ) { }

  ngOnInit() {

    this.form = this.fb.group({
      id: [""],
      // productName: [''],
      description:['', Validators.required],
       batch: ['', Validators.required],
      code: [''],
      fecha: ["", [Validators.required]],
      quantity: ["", [Validators.required]],
      entrance: [""],
      issues: [""],
      unitCost: [""],
      totalCost: [""],
    });

    this.getAllProducts();

  }


   get materials(): FormArray {
    return this.form.get("rawMaterials") as FormArray;
  }

  getAllProducts() {
    this.productionservice.getAllProducts().subscribe(res => {
      this.products = res;
      console.log("PRODUCTS ", this.products);

    });
  }

  onEntrada(){
    this.entrada = true;
    console.log('ENTRADA ', this.entrada);

  }

  onSalida() {
    this.entrada = false;
    console.log('ENTRADA ', this.entrada);

  }


  selectCode(event){

    console.log('SELECT CODE ', event );
     this.product = this.products.find( res => res.id === event.target.selectedIndex);
    console.log('RESULTADO ', this.product);
    this.form.get('code').setValue(this.product.code);
    this.form.get('unitCost').setValue(this.product.unitCost);
    this.recalculateCost();

  }


  recalculateCost() {
     console.log('QUANTITY ', this.form.get('quantity').value);

    this.form.get('totalCost').setValue(this.form.get('unitCost').value * this.form.get('quantity').value);
  }


   onSubmit(){

    if(this.entrada){
      console.log('is ture');
      this.form.get('entrance').setValue(this.form.get('quantity').value);
      this.form.get('issues').setValue(0);

    }else {
      this.form.get('issues').setValue(this.form.get('quantity').value);
      this.form.get('entrance').setValue(0);
    }
  //  console.log('FORM DATE', this.form.get('fecha').value);
  //  console.log('FUNCION FORM DATE ', this.formatDate(this.form.get('fecha').value));
    let myDate = this.formatDate(this.form.get('fecha').value);
  //   let myDate = this._wharehouseService.formatDate(this.form.get('fecha').value);
     this.form.get('fecha').setValue(myDate);

    let resource = JSON.stringify(this.form.value);
 //   console.log('FORM JSON ', resource);
    this._wharehouseService.addMovementWharehouse(resource).subscribe(res =>{

      console.log('resultado ', res);


    })


    // this.productionservice.addProduction(resource).subscribe(res=> {
    //   console.log('production ', res);
    //   this.cleanForm();

    // });



  }

  cleanForm(){
    this.form.get('initialDate').setValue('');
    this.form.reset();
  //  console.log('ARRAY LENGHT', this.materials.length);

  }

  formatDate(date) {


    console.log('VALOR DE NEW DATE ', new Date(2020,0,1));

    var parts = date.split("-")
    console.log('PARTS ', parts);
    const event = new Date(parts[0],parts[1]-1,parts[2]);
    const jsonDate = event.toJSON();
    console.log('JSON DATE IS ',jsonDate);

  return new Date(parts[0], parts[1] - 1, parts[2])
}

}
