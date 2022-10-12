import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { UserService } from 'src/service/user.service';
import { DataService } from 'src/service/data.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
  users:User[]=[];
  user:User = new User("","","","","");
  email:string="";

  constructor(private uS : UserService, private dataService: DataService) { 

  }

  ngOnInit(): void {
    this.email = this.uS.email;
    this.getUserData();
  }

  getUserData(){
    this.dataService.loadUsers().subscribe(users=>{
      console.log(users);
      this.users = Object.values(users);
      for(let i = 0; i < this.users.length; i++){
        if(this.users[i].email == this.email){
          this.user = this.users[i];
        }
      }
    } );

    

  }

  setEmail(email:string){
    this.email = email;
  }
}


