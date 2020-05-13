import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankComponent } from './bank.component';
import { AddBankAccountComponent } from './add-bank-account/add-bank-account.component';
import { AddBankMovementComponent } from './add-bank-movement/add-bank-movement.component';
import { AddFileBankMovementComponent } from './add-file-bank-movement/add-file-bank-movement.component';
import { AddAccountingPolicyComponent } from '../account/add-accounting-policy/add-accounting-policy.component';
import { AddBankingAccountComponent } from './add-banking-account/add-banking-account.component';
import { BankingAccountListComponent } from './banking-account-list/banking-account-list.component';
import { BankMovementRegisterComponent } from './bank-movement-register/bank-movement-register.component';
import { EditBankMovementRegisterComponent } from './edit-bank-movement-register/edit-bank-movement-register.component';


const routes: Routes = [

  {
    path: "add-bank-account",
    component: AddBankingAccountComponent
  },
  {
    path:"add-bank-movement",
    component: AddBankMovementComponent
  },
  {
    path:"add-file-bankmovement",
    component:AddFileBankMovementComponent
  },
  {
    path:"banking-account-list",
    component: BankingAccountListComponent
  },
  {
    path:"bank-movement-register",
    component: BankMovementRegisterComponent
  },
  {
    path: 'edit/:id',
    component: AddBankingAccountComponent
  },
  {
    path: 'edit-bank-movement-register/:id',
    component: EditBankMovementRegisterComponent
  },
  {
    path: ':id',
    component: AddAccountingPolicyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankRoutingModule { }
