import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/service/user.service';
import { AppComponent } from '../app.component';
import { EditorType } from '../app.component';
import { Register } from '../register/register';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private userService:UserService, private type: AppComponent) { }

  ngOnInit(): void {
  }

  toggleEditor(edit:EditorType) {
    this.type.editor = edit;
  }

  logIn(logInForm:NgForm){
    var formValue = logInForm.value;
    this.userService.signIn(new Register(formValue.email, formValue.password));
  }
}
