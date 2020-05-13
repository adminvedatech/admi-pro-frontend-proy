import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { SupplierInvoiceListComponent } from './supplier/supplier-invoice-list/supplier-invoice-list.component';


const routes: Routes = [
  {
    path: "invoice-list",
    component: InvoiceListComponent
  },
  {
    path: "invoice-supplier-list",
    component: SupplierInvoiceListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
