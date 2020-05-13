import { Component, OnInit } from '@angular/core';
import { Bank } from '../bank.model';
import { BankService } from '../bank.service';

@Component({
  selector: 'app-banking-account-list',
  templateUrl: './banking-account-list.component.html',
  styleUrls: ['./banking-account-list.component.css']
})
export class BankingAccountListComponent implements OnInit {

  banks: Bank[] = [];

  constructor(private _bankService: BankService) { }

  ngOnInit() {

    this.getAllBankingAccount();

  }

  getAllBankingAccount() {
    this._bankService.getAllBankAccounts().subscribe(res => {
      this.banks = res;
      console.log('ACCOUNT TYPE ', this.banks);

    })
  }
}
