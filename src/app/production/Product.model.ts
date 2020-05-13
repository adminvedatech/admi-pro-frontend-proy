import { NgModel } from '@angular/forms';

export class Product {

  id: number
  code: string;
  productName: string;
  unitPrice: number;
  unitCost: number;
  type: string;
  subType: string;


}

export class rawMaterials {

  id: number;
  codeProduct: number;
  quantity: number;
  rawmaterial: string;
  unitCost: number;
  total: number;

}

export class Production {

  id: number;
  code: string;
  product: string;
  initialDate: Date;
  finalDate:Date;
  batch: string;
  observation: string;
  cost: number;
  totalCost: number;
  quantity: number;
  productName: Product;
  rawMaterials: rawMaterials;


}
