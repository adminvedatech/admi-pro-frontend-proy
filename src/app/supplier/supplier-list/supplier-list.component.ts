import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../supplier.service';
import { Supplier } from '../supplier.model';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {

  suppliers: Supplier[] = [];
  isTax:Boolean = true;

  constructor(private _supplierService: SupplierService) { }

  ngOnInit(): void {
    this.getAllSuppliers();
  }

  getAllSuppliers(){

    this._supplierService.getAllSuppliers().subscribe(res => {
      console.log('Suppliers ', res);
      this.suppliers = res;

    })

  }

  onUpdate(id:number){

    console.log('UPDATE ', id);
    this._supplierService.getSupplierById(id).subscribe(res=> {
      console.log('SUPPLIER ', res);

    });

  }

}
