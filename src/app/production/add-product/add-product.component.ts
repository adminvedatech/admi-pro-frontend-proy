import { Component, OnInit } from "@angular/core";
import { ProductionService } from "../production.service";
import Swal from "sweetalert2";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Product } from "../Product.model";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductListComponent } from "../product-list/product-list.component";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.css"]
})
export class AddProductComponent implements OnInit {
  form: FormGroup;
  product: Product;
  id: string;
  products: Product[] = [];

  progress: { percentage: number } = { percentage: 0 };
  selectedFile: File = null;
  name = "";
  currentFileUpload: File = null;

  productClean: {
    id: "",
    code:"",
    productName: "",
    unitCost: "",
    unitPrice:"",
    type:"",
    subType:""
  }

  constructor(
    private _prodService: ProductionService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [""],
      // productName: [''],
      code: ["", [Validators.required]],
      productName: ["", Validators.required],
      unitPrice: [""],
      unitCost: [""],
      type: [""],
      subType: [""]
    });

    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id != null) {
      console.log("HAY PARAMETRO", this.id);
      this.getProductById();
    } else {
      console.log("NO HAY PARAMETRO ", this.id);
    }

    // this.invoiceservice.refreshNeeded$
    // .subscribe(() => {
    //   this.getAllInvoices();
    // });
  }

  /*----------- Selecciona Archivo AccountType en formato CSV para ser Enviado -------------*/
  onFileSelected(event) {
    this.progress.percentage = 0;
    this.selectedFile = <File>event.target.files[0];
    try {
      this.name = this.selectedFile.name;
      console.log(this.selectedFile.name.split("."));
      console.log("File Name ", this.name.split(".")[0]);

      if (this.name.split(".")[1] !== "csv") {
        console.log("ERROR!");
        this.cancelFile();
        Swal.fire({
          icon: "error",
          title: "Error de Formato",
          text: "Seleccione un archivo con formato CSV!"
        });
      } else {
        console.log("go ahead");
      }
    } catch (error) {
      console.log(error);
      this.cancelFile();
      console.log("ERROR ", error);

      // swal('Error!', 'Cancelar y seleccionar un archivo nuevo!', 'warning');
    }
  }

  /*----------- Envia Archivo AccountType en formato CSV al Servidor -------------*/
  onUploadTxtFile() {
    const fd = new FormData();
    try {
      fd.append("file", this.selectedFile, this.selectedFile.name);
      console.log("File Name ", this.name.split(".")[0]);
      this.progress.percentage = 0;
      this.currentFileUpload = this.selectedFile;
      this._prodService
        .pushFileToStorage(this.currentFileUpload)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress.percentage = Math.round(
              (100 * event.loaded) / event.total
            );
          } else if (event instanceof HttpResponse) {
            console.log("File is completely uploaded!", event);

            // this.snackbarService.success(':: Proceso exitoso!');
            this.selectedFile = null;
            this.name = null;
            //     this.getAllBankTransaction();
            this.progress.percentage = 0;
            Swal.fire({
              icon: "success",
              text: "Operacon exitosa: ",
              title: "Alta de Archivo"
            });
          }

          // },
          //  error => {
          //   // this.snackbarService.fail(':: Error en el Servidor!');

          //   console.log('ERROR',error);
          //     //  Swal('Mensaje del Servidor:', `Error!!...El numero de la Factura ya existe `, 'error');
        });
    } catch (error) {
      // swal('Error!', 'Seleccionar un archivo XML para ser enviado!', 'warning');
      console.log("que flojera otro catch");
    }
  }

  getProductById() {
    this._prodService.getProductById(this.id).subscribe(res => {
      this.product = res;
      this.form.setValue(this.product);
    });
  }

  onSubmit() {
    if (this.id != null) {
      this._prodService.updateProduct(this.form.value).subscribe(res => {
        Swal.fire({
          icon: "success",
          text: "Se actualilzo el Producto",
          title: "Proceso exitoso"
        });
      });
      this.router.navigate(["/production/product-list"]);
    } else {
      this._prodService.addProduct(this.form.value).subscribe(res => {
        Swal.fire({
          icon: "success",
          text: "Se agrego el Producto",
          title: "Proceso exitoso"
        });
      });
    }
    this.cleanForm();
  }

  /*----------- Cancela enviar Archivo -------------*/
  cancelFile() {
    this.selectedFile = null;
    this.name = null;
    console.log("Cancel File", this.selectedFile);
  }

  cleanForm() {
    this.form.setValue(this.productClean);
  }
}
