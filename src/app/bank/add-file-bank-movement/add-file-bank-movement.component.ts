import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { SubAccount, Cuentas } from 'src/app/account/account.model';
import { AccountService } from 'src/app/account/account.service';
import { BankService } from '../bank.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { DOCUMENT } from '@angular/common';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-file-bank-movement',
  templateUrl: './add-file-bank-movement.component.html',
  styleUrls: ['./add-file-bank-movement.component.css']
})
export class AddFileBankMovementComponent implements OnInit {

  progress: { percentage: number } = { percentage: 0 };
  selectedFile: File = null;
  name = '';;
  currentFileUpload: File = null;
  accountsType: Cuentas[]=[];
  movements: any[]=[];


  constructor(private accountService: AccountService,
              private _bankservice: BankService,
              @Inject(DOCUMENT) private _document,
              private router: Router) { }

  ngOnInit() {
    this._document.body.classList.add('bodybg-color');
    this._bankservice.refreshNeeded$
    .subscribe(() => {
      this.getBankMovementRegister();
    });
    this.getBankMovementRegister();
  }

   /*----------- Selecciona Archivo AccountType en formato CSV para ser Enviado -------------*/
   onFileSelected(event) {
    this.progress.percentage = 0;
    this.selectedFile = <File>event.target.files[0];
    try {
      this.name = this.selectedFile.name;
      console.log(this.selectedFile.name.split('.'));
      if ( this.name.split('.')[1] !== 'csv') {
        console.log('ERROR!');
        this.cancelFile();
        Swal.fire({
          icon: 'success',
          title: 'Proceso',
          text: 'Transaccion con exito!',
          // footer: '<a href>Why do I have this issue?</a>'
        });

    } else {
        console.log('go ahead');
      }
    } catch (error) {
      console.log('ERROR EN ARCHIVO',error.error);
      this.cancelFile();
      // swal('Error!', 'Cancelar y seleccionar un archivo nuevo!', 'warning');
    }
}


/*----------- Envia Archivo AccountType en formato CSV al Servidor -------------*/
onUploadTxtFile() {
  const fd = new FormData();
  try {
    fd.append('file', this.selectedFile, this.selectedFile.name);
    this.progress.percentage = 0;
    this.currentFileUpload = this.selectedFile;
    this._bankservice.pushFileToStorage(this.currentFileUpload).subscribe(event => {

      if (event.type === HttpEventType.UploadProgress) {
          this.progress.percentage = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          console.log('File is completely uploaded!');
          // this.snackbarService.success(':: Proceso exitoso!');
          this.selectedFile = null;
          this.name = null;
           this.getAllAccountType();
          this.progress.percentage = 0;

        }
      }, error => {
        // this.snackbarService.fail(':: Error en el Servidor!');
        console.log('ERROR AL ENVIO ', error.error);
        Swal.fire({
          icon: 'error',
          title: 'Envio de Archivo de Banco',
          text: 'El Archivo no contiene la cuenta Bancaria o es erronea!',
          // footer: '<a href>Why do I have this issue?</a>'
        });

        this.router.navigate(['/bank/add-bank-account']);
        this.cancelFile();
        // console.log(error, '/', error.error);
          //  Swal('Mensaje del Servidor:', `Error!!...El numero de la Factura ya existe `, 'error');
       }
      );
  } catch (error) {
    // swal('Error!', 'Seleccionar un archivo XML para ser enviado!', 'warning');
  }
}


/*----------- Cancela enviar Archivo -------------*/
cancelFile() {
  this.selectedFile = null;
  this.name = null;
  console.log('Cancel File', this.selectedFile);
}

getAllAccountType() {
  this.accountService.getAllAccounts().subscribe(res => {
    this.accountsType = res;
    console.log('ACCOUNT TYPE ', this.accountsType);

  })
}

  getBankMovementRegister(){

    this._bankservice.getAllBankMovementCsv().subscribe(res => {

      this.movements = res;
      console.log("MOVEMENT REGISTER ", res);

    });
  }

  deleteBankMovement(index){

    console.log('EVENT ', index);
     let movement =  this.movements.find(res => res.id === index);

    if(!movement.enabled) {
      Swal.fire({
        icon: 'warning',
        title: 'El Movimiento no tiene Poliza!',
        text: 'Agrege una Poliza antes de borrar el movimiento!',
        // footer: '<a href>Why do I have this issue?</a>'
      });

    }else {

      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {

        console.log('NO DELETED');

        if (result.value) {
          console.log('DELETED');
           this._bankservice.deleteBankMovement(index).subscribe( res=> {
            console.log('DELETE IS ', res);

        })

          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })
    }




  }



}
