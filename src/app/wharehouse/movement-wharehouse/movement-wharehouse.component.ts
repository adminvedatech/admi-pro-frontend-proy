import { Component, OnInit } from '@angular/core';
import { WharehouseService } from '../wharehouse.service';
import { Wharehouse } from './wharehouse.model';

@Component({
  selector: 'app-movement-wharehouse',
  templateUrl: './movement-wharehouse.component.html',
  styleUrls: ['./movement-wharehouse.component.css']
})
export class MovementWharehouseComponent implements OnInit {

  movements: Wharehouse[] = [];

  constructor(private _wharehouseService: WharehouseService) { }

  ngOnInit(): void {

    this._wharehouseService.getMovementsWharehouse().subscribe( res => {
      this.movements = res;

      console.log('MOVEMENTS WHAREHOUSE ', res);
      console.log('MOVEMENTS WHAREHOUSE ', this.movements[0].fecha);


    })
  }

}
