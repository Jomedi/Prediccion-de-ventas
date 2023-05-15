import { Component, OnInit } from '@angular/core';
import { User } from '../user/user';
import { LoginService } from '../login/login.service';
import { DataService } from '../data/data.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Feedback } from '../feedback/feedback';

@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.css']
})
export class TopNavBarComponent implements OnInit {

  users:User[]=[];
  user:User = User.emptyUser()
  email:string="";
  profileImage:string = "/assets/images/profileImage.png";
  editing:Boolean = false;
  searchQuery: string = ""
  feedbacks: Feedback[]=[]
  pendingFeedbacks:number= 0

  constructor(private loginService : LoginService, private dataService: DataService, private router:Router, public cookie: CookieService) {
  }

  ngOnInit(): void {
    this.email = this.loginService.getIdToken()
    this.getUserData(this.email)
    // console.log(this.loginService.getIdToken());
    this.noLoginCase()

  }

  countPendingFeedbacks(){
    if(this.user.feedbackOpened.length > 0){
      this.user.feedbackOpened.forEach(feed=>{
        if (feed == false)
          this.pendingFeedbacks++
      })
      console.log("Pending feedbacks: ", this.pendingFeedbacks)
    }
    
  }


  isUserAdmin(){
    return this.email === "a@a.es"
  }

  getUserData(email:string){
    this.dataService.loadUsers().subscribe(dbUsers=>{
      this.users = Object.values(dbUsers)
      for(let i = 0; i < this.users.length; i++){
        if(this.users[i].email == email)
          this.user = this.users[i]
      }
      this.countPendingFeedbacks()
    } )
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

  routeToProfile(){
    this.router.navigate(['/profile']);
  }

  noLoginCase(){
    if(this.email.length < 3)
      this.router.navigate(['login']);
  }

  isAdmin(){
    return this.user.email === "a@a.es"
  }

  searchProduct(searchBar: NgForm) {
    var formValue = searchBar.value
    console.log(formValue.searchInput)
    this.searchQuery = formValue.searchInput
    this.cookie.set("searchQuery", formValue.searchInput)
  }

}
