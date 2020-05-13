import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { SalesByItems } from '../Report';

@Component({
  selector: 'app-report-sales-items',
  templateUrl: './report-sales-items.component.html',
  styleUrls: ['./report-sales-items.component.css']
})
export class ReportSalesItemsComponent implements OnInit {

  salesByItems: SalesByItems[] = [];
  salesByItemsFeb: SalesByItems[]=[];
  Total: number = 0;
  TtlCant: number = 0;
  precioPr: number = 0;

  TotalFeb: number = 0;
  TtlCantFeb: number = 0;
  precioPrFeb: number = 0;

  constructor(public reportservice: ReportService) { }

  ngOnInit(): void {
    this.getSales();
  }

  getSales(){
    this.reportservice.getAllSales().subscribe(res=>{
      console.log('RES ', res);
      this.salesByItems = res;
      this.CalcTotales(this.salesByItems);

    })

    this.reportservice.getAllSalesFebrero().subscribe(resFeb=> {
      console.log('RES FEB', resFeb);
      this.salesByItemsFeb = resFeb;
      this.CalcTotalesFeb(this.salesByItemsFeb)

    })
  }

  CalcTotales(salesBy: SalesByItems[]) {
    for(let i = 0; i< salesBy.length; i ++) {
      this.Total = this.Total + salesBy[i].importe;
      this.TtlCant = this.TtlCant + salesBy[i].cantidad;

    }
    this.precioPr = this.Total/this.TtlCant;
  }

  CalcTotalesFeb(salesBy: SalesByItems[]) {
    for(let i = 0; i< salesBy.length; i ++) {
      this.TotalFeb = this.TotalFeb + salesBy[i].importe;
      this.TtlCantFeb = this.TtlCantFeb + salesBy[i].cantidad;

    }
    this.precioPrFeb = this.TotalFeb/this.TtlCantFeb;
  }

}
