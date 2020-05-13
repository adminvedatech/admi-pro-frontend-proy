import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceService } from './invoice.service';
import { SupplierComponent } from './supplier/supplier.component';
import { SupplierInvoiceListComponent } from './supplier/supplier-invoice-list/supplier-invoice-list.component';


@NgModule({
  declarations: [InvoiceComponent, InvoiceListComponent, SupplierComponent, SupplierInvoiceListComponent],
  imports: [
    CommonModule,
    InvoiceRoutingModule
  ],
  providers: [
    InvoiceService
  ]
})
export class InvoiceModule { }
