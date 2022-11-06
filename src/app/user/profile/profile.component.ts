import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/login/login.service';
import { DataService } from 'src/app/data/data.service';
import { User } from '../user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
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
    console.log(this.loginService.getIdToken());
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
    if(this.email == ""){
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
 

}
