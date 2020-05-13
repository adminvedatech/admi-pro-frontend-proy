import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportSalesItemsComponent } from './report-sales-items/report-sales-items.component';


@NgModule({
  declarations: [ReportSalesItemsComponent],
  imports: [
    CommonModule,
    ReportRoutingModule
  ]
})
export class ReportModule { }
