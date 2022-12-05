import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data/data.service';
import { LoginService } from 'src/app/login/login.service';
import { User } from '../user';

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

  constructor(private dataService:DataService, private loginService:LoginService) { }

  ngOnInit(): void {
  }

  getUserData(){
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

}
