import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Data, Router } from '@angular/router';
import { Register } from '../register/register';
import { LoginService } from './login.service';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../data/data.service';
import { User } from '../user/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService:LoginService, private router:Router, private cookie:CookieService, private dataService:DataService) { }

  ngOnInit(): void {
  }

  logIn(logInForm:NgForm){
    var formValue = logInForm.value;
    this.loginService.signIn(new Register(formValue.email, formValue.password)).then(response=>{
       this.dataService.loadUsers().subscribe(user=>{
        let users = Object.values(user)
        users.forEach(user => {
            if(user.email == this.cookie.get("email")){
                this.fillCookieWithUserData(user)
                console.log(this.cookie.get("favouriteProducts"))
            }
        })
    })
      }).catch(error => console.log(error)); 
  }

  fillCookieWithUserData(user:User){
    this.cookie.set( "email", user.email);
    this.cookie.set( "address" , user.address)
    this.cookie.set( "date" , user.date)
    this.cookie.set( "favouriteProducts" , user.favourite_products.toString())
    this.cookie.set( "gender" , user.gender)
    this.cookie.set( "key" , user.key)
    this.cookie.set( "name" , user.name)
    this.cookie.set( "password", user.password)
}

  routeToRegister(){
    this.router.navigate(['/register'])
  }

}
