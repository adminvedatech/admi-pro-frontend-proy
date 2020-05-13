import { NgModule } from '@angular/core';

import { BankRoutingModule } from './bank-routing.module';
import { BankService } from './bank.service';
import { CommonModule } from '@angular/common';
import { AddBankAccountComponent } from './add-bank-account/add-bank-account.component';
import { AddBankMovementComponent } from './add-bank-movement/add-bank-movement.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddFileBankMovementComponent } from './add-file-bank-movement/add-file-bank-movement.component';
import { AddBankingAccountComponent } from './add-banking-account/add-banking-account.component';
import { BankingAccountListComponent } from './banking-account-list/banking-account-list.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { BankMovementRegisterComponent } from './bank-movement-register/bank-movement-register.component';
import { EditBankMovementRegisterComponent } from './edit-bank-movement-register/edit-bank-movement-register.component';
export let options: Partial<IConfig> | (() => Partial<IConfig>);


@NgModule({
  declarations: [AddBankAccountComponent, AddBankMovementComponent, AddFileBankMovementComponent, AddBankingAccountComponent, BankingAccountListComponent, BankMovementRegisterComponent, EditBankMovementRegisterComponent],
  imports: [
    CommonModule,
    BankRoutingModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(options),
    FormsModule
  ],
  providers: [
    BankService
  ]
})
export class BankModule { }
