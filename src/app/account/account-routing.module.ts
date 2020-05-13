import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account.component';
import { SubaccountComponent } from './subaccount/subaccount.component';
import { SubaccountListComponent } from './subaccount-list/subaccount-list.component';
import { AddAccountingPolicyComponent } from './add-accounting-policy/add-accounting-policy.component';
import { AddSubaccountComponent } from './add-subaccount/add-subaccount.component';
import { EditAccountingPolicyComponent } from './edit-accounting-policy/edit-accounting-policy.component';
import { AddDiaryPolicyComponent } from './add-diary-policy/add-diary-policy.component';

const routes: Routes = [
  {
    path: 'add-account',
    component: AccountComponent
  },
  {
    path: 'add-subaccount',
    component: AddSubaccountComponent
  },
  {
    path: 'subaccount-list',
    component: SubaccountListComponent
  },
  {
    path: 'add-accounting-policy',
    component: AddAccountingPolicyComponent
  },
  {
    path: 'add-accounting-policy/:id/:id2',
    component: AddAccountingPolicyComponent
  },
  {
    path: 'edit-accounting-policy/:id',
    component: EditAccountingPolicyComponent
  },
  {
    path: 'supplier/:id',
    component: AddDiaryPolicyComponent
  },
  {
    path: ':id/',
    component: AddAccountingPolicyComponent
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
