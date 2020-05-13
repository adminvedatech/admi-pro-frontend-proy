import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MovementWharehouseComponent } from './movement-wharehouse/movement-wharehouse.component';
import { InventoryComponent } from './inventory/inventory.component';
import { AddMovementWharehouseComponent } from './add-movement-wharehouse/add-movement-wharehouse.component';


const routes: Routes = [
  {
    path: 'movements-wharehouse',
    component:MovementWharehouseComponent
  },
  {
    path: 'inventory',
    component: InventoryComponent
  },
  {
    path: 'add-movement-wharehouse',
    component: AddMovementWharehouseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WharehouseRoutingModule { }
