import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { AccountService } from './account.service';
// import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { SubaccountComponent } from './subaccount/subaccount.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { SubaccountListComponent } from './subaccount-list/subaccount-list.component';
import { AddAccountingPolicyComponent } from './add-accounting-policy/add-accounting-policy.component'
import { BankService } from '../bank/bank.service';
import { AddSubaccountComponent } from './add-subaccount/add-subaccount.component';
import { EditAccountingPolicyComponent } from './edit-accounting-policy/edit-accounting-policy.component';
import { AddDiaryPolicyComponent } from './add-diary-policy/add-diary-policy.component';

export let options: Partial<IConfig> | (() => Partial<IConfig>);



@NgModule({
  declarations: [AccountComponent, SubaccountComponent, SubaccountListComponent, AddAccountingPolicyComponent, AddSubaccountComponent, EditAccountingPolicyComponent, AddDiaryPolicyComponent],
  imports: [
    CommonModule,
    NgxMaskModule.forRoot(options),
    AccountRoutingModule,
    ReactiveFormsModule,
    // AngularFontAwesomeModule

  ],
  providers: [AccountService],
})
export class AccountModule { }
