import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/login/login.service';
import { DataService } from 'src/app/data/data.service';
import { User } from '../user';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

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

  constructor(private loginService : LoginService, private dataService: DataService, private router:Router, private cookie:CookieService) {
  }

  ngOnInit(): void {
    this.getUserData()
  }

  getUserData(){
    this.user = this.userSession();
  }

  userSession(){
    return new User(this.cookie.get("email"), this.cookie.get("name"), this.cookie.get("date"), this.cookie.get("address"), 
                    this.cookie.get("gender"), this.cookie.get("password"),this.cookie.get("key") ,this.cookie.get("favouriteProducts").split(","))
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
