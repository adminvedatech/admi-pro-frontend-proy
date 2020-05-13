import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportComponent } from './report.component';
import { ReportSalesItemsComponent } from './report-sales-items/report-sales-items.component';


const routes: Routes = [
  {
    path: "sales-by-items",
    component: ReportSalesItemsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
