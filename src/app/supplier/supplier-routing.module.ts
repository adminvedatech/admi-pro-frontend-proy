import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { AddInvoiceSupplierComponent } from './add-invoice-supplier/add-invoice-supplier.component';


const routes: Routes = [
  {
    path: 'add-supplier',
    component: AddSupplierComponent
  },
  {
    path: 'supplier-list',
    component: SupplierListComponent
  },
  {
    path: 'add-invoice-supplier',
    component: AddInvoiceSupplierComponent
  },
  {
    path: ':id',
    component: AddSupplierComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
