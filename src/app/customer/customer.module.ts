import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerService } from './customer.service';


@NgModule({
  declarations: [CustomerComponent, CustomerListComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule
  ],
  providers: [
    CustomerService
  ]
})
export class CustomerModule { }
