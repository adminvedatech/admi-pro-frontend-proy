import { Component, OnInit } from '@angular/core';
import { TestService } from './test.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(private _testService: TestService) { }

  ngOnInit(): void {

    this._testService.getAllSalesFebrero().subscribe(res=> {
      console.log('TEST SERVICE ', res);

    });

    this._testService.getCostByMonth().subscribe(res=>{

      console.log('COST BY MONTH');

    });

    this._testService.getMovementWharehouse().subscribe(res => {
      console.log('MOVEMENTS WHAREHOUSE ', res);

    });

    this._testService.getProductionDate().subscribe(res => {
      console.log('PRODUCTION DATE');

    })
  }

}
