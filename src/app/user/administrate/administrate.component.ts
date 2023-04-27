import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data/data.service';
import { LoginService } from 'src/app/login/login.service';
import { User } from '../user';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-administrate',
  templateUrl: './administrate.component.html',
  styleUrls: ['./administrate.component.css']
})
export class AdministrateComponent implements OnInit {
  users:User[]=[]
  user:User = User.emptyUser()
  editing:boolean = false
  email:string = ""
  id:number=-1

  constructor(private dataService:DataService, private loginService:LoginService, private cookie:CookieService) { }

  ngOnInit(): void {
    this.getAllUsers()
  }

  getUserData(){
    this.email = this.cookie.get("email")
    this.dataService.loadUsers().subscribe(dbUsers=>{
      this.users = Object.values(dbUsers);
      for(let i = 0; i < this.users.length; i++){
        if(this.users[i].email == this.email){
          this.user = this.users[i];
          this.editing = true;
        }
      }
    } );
  }

  getUserDataByEmail(email:string){
    this.dataService.loadUsers().subscribe(dbUsers=>{
      this.users = Object.values(dbUsers);
      for(let i = 0; i < this.users.length; i++){
        if(this.users[i].email == email){
          this.user = this.users[i];
          this.editing = true;
        }
      }
    } );
  }

  getAllUsers(){
    this.dataService.loadUsers().subscribe(dbUsers=>{
      this.users = Object.values(dbUsers)
      this.users
    })
  }

  isUserAdmin(){
    return this.cookie.get("email") == "a@a.es"
  }

  updateUser(){
    this.dataService.updateUser(this.user)
    this.editing = false
  }

  isEditing(){
    return this.editing;
  }

  deleteConcreteUser(){
    this.loginService.delUser(this.user, false)
    this.dataService.deleteUser(this.user)
    this.editing = false;
  }

  openModal(id: number) {
    this.id = id;
    console.log(this.id)
  }

}
