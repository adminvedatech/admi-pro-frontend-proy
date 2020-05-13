import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductionRoutingModule } from './production-routing.module';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductionService } from './production.service';
import { ProductListComponent } from './product-list/product-list.component';
import { AddProductionComponent } from './add-production/add-production.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddProductComponent, ProductListComponent, AddProductionComponent],
  imports: [
    CommonModule,
    ProductionRoutingModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  providers: [
    ProductionService
  ]
})
export class ProductionModule { }
