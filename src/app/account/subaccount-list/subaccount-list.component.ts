import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { AccountType, SubAccount } from '../account.model';

@Component({
  selector: 'app-subaccount-list',
  templateUrl: './subaccount-list.component.html',
  styleUrls: ['./subaccount-list.component.css']
})
export class SubaccountListComponent implements OnInit {

  subAccounts: SubAccount[] = [];

  constructor(private accountService: AccountService) { }

  ngOnInit() {

    this.getAllAccountType();

  }

  getAllAccountType() {
    this.accountService.getAllSubAccounts().subscribe(res => {
      this.subAccounts = res;
      console.log('ACCOUNT TYPE ', this.subAccounts);
      
    })
  }

}
