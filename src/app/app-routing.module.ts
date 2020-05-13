import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: 'account',
  // component: BanksComponent
  loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
   canActivate: [AuthGuard]
  },
  { path: 'bank',
  // component: BanksComponent
  loadChildren: () => import('./bank/bank.module').then(m => m.BankModule),
   canActivate: [AuthGuard]
  },
  { path: 'customer',
  // component: BanksComponent
  loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
   canActivate: [AuthGuard]
  },
  { path: 'invoice',
  // component: BanksComponent
  loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule),
   canActivate: [AuthGuard]
  },
  { path: 'production',
  // component: BanksComponent
  loadChildren: () => import('./production/production.module').then(m => m.ProductionModule),
   canActivate: [AuthGuard]
  },
  { path: 'reports',
  // component: BanksComponent
  loadChildren: () => import('./report/report.module').then(m => m.ReportModule),
   canActivate: [AuthGuard]
  },
  { path: 'supplier',
  // component: BanksComponent
  loadChildren: () => import('./supplier/supplier.module').then(m => m.SupplierModule),
   canActivate: [AuthGuard]
  },
  { path: 'wharehouse',
  // component: BanksComponent
  loadChildren: () => import('./wharehouse/wharehouse.module').then(m => m.WharehouseModule),
   canActivate: [AuthGuard]
  },
  { path: 'test',
  // component: BanksComponent
  loadChildren: () => import('./test/test.module').then(m => m.TestModule),
   canActivate: [AuthGuard]
  },

  { path: 'login',
  component: LoginComponent
  },
  {
    path: '**', pathMatch: 'full', redirectTo: '/'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
