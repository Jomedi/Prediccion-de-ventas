import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { DataService } from 'src/app/data/data.service';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import {
  ScannerQRCodeConfig,
  ScannerQRCodeSelectedFiles,
  NgxScannerQrcodeService,
  ScannerQRCodeResult,
  NgxScannerQrcodeComponent
} from 'ngx-scanner-qrcode';
import { ViewChild, ElementRef} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-user',
  template: ' <qr-code [value]="value" (decode)="onCodeDecode($event)"></qr-code>',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
  @ViewChild('closeButton') closeButton : any;

  users:User[]=[];
  user:User = User.emptyUser()
  email:string="";
  profileImage:string = "/assets/images/profileImage.png";
  editing:Boolean = false;
  value: string = ""

  selectedDevice = 'rear';


  result:ScannerQRCodeResult[]=[]

  constructor(private loginService : LoginService, private dataService: DataService, private router:Router, public cookie:CookieService) {
  }

  ngOnInit(): void {
    this.email = this.loginService.getIdToken();
    this.getUserData(this.email);
    // console.log(this.loginService.getIdToken());
    this.noLoginCase();
  }

  async startMethod(action : any){
    await action.start()
    if(action.devices && action.devices.length > 1)
      action.playDevice(action.devices.value[1])
  }

  stopMethod(action: any){
    action.stop()
  }

  onCodeDecodePrueba(){
    this.value = "http://localhost:4200/details/-NJ5xumjTKwKncj8iVkT"
    this.cookie.set("qrCode", this.value)
    this.closeButton.nativeElement.click()
    this.router.navigate([this.value.substring(22)])
  }

  onCodeDecode(result:ScannerQRCodeResult[], action : any) {
    this.result = result
    if (this.result && this.result.length > 0){
      this.cookie.set("qrCode",this.result[0].value.substring(22))
      this.closeButton.nativeElement.click()
      this.router.navigate([this.cookie.get("qrCode")])
    }
    if(action.devices && action.devices.length > 1)
      action.playDevice(action.devices.value[1])
    // if(this.result && this.result != null && result.length != 0){
    //   this.cookie.set("qrCode", result.toString())
    //   this.closeButton.nativeElement.click();
    //   this.stopMethod(action)
    // }
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


