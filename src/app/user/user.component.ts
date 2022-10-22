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
  user:User = new User("","","","","");
  email:string="";
  profileImage:string = "/assets/images/profileImage.png";

  constructor(private loginService : LoginService, private dataService: DataService, private router:Router) { 
  }

  ngOnInit(): void {
    this.email = this.loginService.getIdToken();
    this.getUserData();
    console.log(this.loginService.getIdToken());
    this.noLoginCase();
  }

  getUserData(){
    this.dataService.loadUsers().subscribe(users=>{
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

  logOut(){
    this.loginService.logOut();
  }

  routeToProducts(){
    this.router.navigate(['/products']);
  }

  noLoginCase(){
    if(this.email == ""){
      this.router.navigate(['login']);
    }
  }

}


