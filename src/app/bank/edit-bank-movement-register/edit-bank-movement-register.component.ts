import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BankService } from '../bank.service';

@Component({
  selector: 'app-edit-bank-movement-register',
  templateUrl: './edit-bank-movement-register.component.html',
  styleUrls: ['./edit-bank-movement-register.component.css']
})
export class EditBankMovementRegisterComponent implements OnInit {

  id: string=""

  constructor( private route: ActivatedRoute,
               private _bankservice: BankService) { }

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get("id");

      console.log("HAY PARAMETRO", this.id);
      this.getBankMovementRegisterById(this.id);

  }

  getBankMovementRegisterById(id) {
    this._bankservice.getBankMovementRegisterById(id).subscribe(res=> {
      console.log('MOVEMENT REGISTER ', res);

    })

  }
}
