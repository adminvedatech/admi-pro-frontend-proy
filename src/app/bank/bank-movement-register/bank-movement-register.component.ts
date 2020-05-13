import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/account/account.service';
import { BankService } from '../bank.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bank-movement-register',
  templateUrl: './bank-movement-register.component.html',
  styleUrls: ['./bank-movement-register.component.css']
})
export class BankMovementRegisterComponent implements OnInit {

  movements: any[]=[];

  constructor(private accountService: AccountService,
    private _bankservice: BankService,
    private router: Router) { }

ngOnInit() {

this._bankservice.refreshNeeded$
.subscribe(() => {
this.getBankMovementRegister();
});
this.getBankMovementRegister();
}


  deleteBankMovement(index){

  }

  getBankMovementRegister(){

    this._bankservice.getAllBankMovementsRegister().subscribe(res => {

      this.movements = res;
      console.log("MOVEMENT REGISTER ", res);

    });
  }

}
