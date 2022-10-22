import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Register } from '../register/register';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService:LoginService, private router:Router) { }

  ngOnInit(): void {
  }

  logIn(logInForm:NgForm){
    var formValue = logInForm.value;
    this.loginService.signIn(new Register(formValue.email, formValue.password)).then(response=>{
       this.loginService.email = formValue.email;
      }).catch(error => console.log(error)); 
  }

  routeToRegister(){
    this.router.navigate(['/register'])
  }
}
