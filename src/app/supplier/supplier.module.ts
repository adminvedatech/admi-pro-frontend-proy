import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierComponent } from './supplier.component';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { SupplierService } from './supplier.service';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { AddInvoiceSupplierComponent } from './add-invoice-supplier/add-invoice-supplier.component';


@NgModule({
  declarations: [SupplierComponent, AddSupplierComponent, SupplierListComponent, AddInvoiceSupplierComponent],
  imports: [
    CommonModule,
    SupplierRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    SupplierService
  ]
})
export class SupplierModule { }
