import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/service/user.service';
import { NgForm } from '@angular/forms';
import { Register } from './register';
import { AppComponent, EditorType } from '../app.component';
import { User } from '../user/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  register = new Register("","")
  user = new User("","","","","")


  constructor(private userService: UserService, private type: AppComponent) {
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
      this.userService.register(registerForm.value).then(response => {
        alert("Correct Register" + response.user);
        this.userService.writeUserData(this.user);
        registerForm.reset()
      })
      .catch(error=>alert(error));
    }
  }

  toggleEditor(edit:EditorType) {
    this.type.editor = edit;
  }

}
