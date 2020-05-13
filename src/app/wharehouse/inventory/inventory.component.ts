import { Component, OnInit } from '@angular/core';
import { WharehouseService } from '../wharehouse.service';
import { Inventory } from '../wharehouse.model';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  inventaries: Inventory[] = [];

  constructor(public _wharehouseService: WharehouseService) { }

  ngOnInit(): void {

    this._wharehouseService.getInventory().subscribe(res => {
      console.log('INVENTROY ', res);
      this.inventaries = res;

    })


  }

}
