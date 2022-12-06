import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { DataService } from 'src/app/data/data.service';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
  users:User[]=[];
  user:User = User.emptyUser()
  email:string="";
  profileImage:string = "/assets/images/profileImage.png";
  editing:Boolean = false;

  constructor(private loginService : LoginService, private dataService: DataService, private router:Router) {
  }

  ngOnInit(): void {
    this.email = this.loginService.getIdToken();
    this.getUserData(this.email);
    // console.log(this.loginService.getIdToken());
    this.noLoginCase();
  }

  getUserData(email:string){
    this.dataService.loadUsers().subscribe(dbUsers=>{
      this.users = Object.values(dbUsers);
      for(let i = 0; i < this.users.length; i++){
        if(this.users[i].email == email){
          this.user = this.users[i];
        }
      }
    } );
    return this.user;
  }

  setEmail(email:string){
    this.email = email;
  }

  public logOut(){
    this.loginService.logOut();
  }

  routeToProducts(){
    this.router.navigate(['/products']);
  }

  routeToProfile(){
    this.router.navigate(['/profile']);
  }

  noLoginCase(){
    if(this.email.length < 3){
      this.router.navigate(['login']);
    }
  }

  deleteUser(){
    this.loginService.delUser(this.user, false)
    this.dataService.deleteUser(this.user)
  }

  modify(){
    this.editing = true;
  }

  updateUser(){
    this.dataService.updateUser(this.user)
    this.editing = false
  }

  isEditing() {
    return this.editing;
  }

  isAdmin(){
    if(this.user.email === "a@a.es"){
      return true
    }
    else{
      return false
    }
  }
}


