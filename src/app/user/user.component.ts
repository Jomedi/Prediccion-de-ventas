import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { DataService } from 'src/app/data/data.service';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-user',
  template: ' <qr-code [value]="value" (decode)="onCodeDecode($event)"></qr-code>',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
  users:User[]=[];
  user:User = User.emptyUser()
  email:string="";
  profileImage:string = "/assets/images/profileImage.png";
  editing:Boolean = false;
  value: string = ""

  constructor(private loginService : LoginService, private dataService: DataService, private router:Router, private qr:QRCodeModule) {
  }

  ngOnInit(): void {
    this.email = this.loginService.getIdToken();
    this.getUserData(this.email);
    // console.log(this.loginService.getIdToken());
    this.noLoginCase();
  }

  onCodeDecode(result:Event) {
    console.log(result);
  }

  isUserAdmin(){
    return this.email === "a@a.es"
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

  isAdmin(){
    if(this.user.email === "a@a.es"){
      return true
    }
    else{
      return false
    }
  }
}


