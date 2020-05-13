import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { AddProductionComponent } from './add-production/add-production.component';
import { AddProductComponent } from './add-product/add-product.component';


const routes: Routes = [
  {path: 'add-product',
   component: AddProductComponent
  },
  {path: 'product-list',
   component: ProductListComponent
  },
  {
    path: 'add-production',
    component: AddProductionComponent
  },
  {
    path: ':id',
    component: AddProductComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionRoutingModule { }
