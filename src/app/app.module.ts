import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';

// Componentes
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { ErrorService } from './interceptors/error.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthRequestOptions } from './interceptors/auth.request';
import { AuthService } from './auth/auth.service';
import { LoginService } from './login/login.service';
import { AuthGuard } from './auth/auth.guard';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report/report.component';
import { ProductionComponent } from './production/production.component';
import { SupplierComponent } from './supplier/supplier.component';
import { AddSupplierComponent } from './supplier/add-supplier/add-supplier.component';
import { TestComponent } from './test/test.component';
import { WharehouseComponent } from './wharehouse/wharehouse.component';
export let options: Partial<IConfig> | (() => Partial<IConfig>);



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    TestComponent,
    WharehouseComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    NgxMaskModule.forRoot(options),
      // FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // AngularFontAwesomeModule

  ],
  providers: [
    AuthGuard,
    AuthService,
    AuthRequestOptions,
    LoginService,
    ErrorService,
    {
      provide: ErrorHandler,
      useClass: ErrorService
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthRequestOptions,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
