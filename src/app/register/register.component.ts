import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Register } from './register';
import { User } from '../user/user';
import { Router } from '@angular/router';
import { DataService } from '../data/data.service';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  register = new Register("","")
  user = new User("","","","","")


  constructor(private registerService: RegisterService, private router: Router, private dataService:DataService) {
  }

  ngOnInit(): void {
  }

  validatePassword(password:string, confirmPassword:string){
    if(password != confirmPassword) {
      alert("Passwords Don't Match");
      return false;
    } else {
      return true;
    }
  }

  newRegister(registerForm: NgForm) {
    var formValue = registerForm.value
    this.user = new User(formValue["email"],formValue["name"],formValue["date"],formValue["address"],formValue["gender"])
    
    if(this.validatePassword(formValue["password"],formValue["passwordr"])){
      this.registerService.register(formValue).then(response => {
        alert("Correct register: " + formValue["email"]);
        this.dataService.saveUser(this.user);
        registerForm.reset();
      })
      .catch(error=>alert(error));
    }
  }

  routeToLogin(){
    this.router.navigate(['/login'])
  }

}
