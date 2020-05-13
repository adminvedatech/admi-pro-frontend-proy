import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { LoginService } from './login.service';
import { AuthService } from '../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(private f: FormBuilder,
              private authservice: AuthService,
              private router: Router,
              private route:ActivatedRoute
              ) { }

  ngOnInit() {

    this.form = this.f.group({
      username: [''],
      password: ['']

    })
  }

  onSubmit() {
    console.log('VALUE FORM', this.form.value);
    
    this.authservice.login(this.form.value).subscribe( res=> {
      res
      console.log('res');
      this.router.navigate(['/dashboard'])
     
    });
  
  }

}
