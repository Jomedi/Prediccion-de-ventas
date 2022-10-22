import { Injectable } from "@angular/core";
import { Auth, signInWithEmailAndPassword } from "@angular/fire/auth";
import { User } from "src/app/user/user";
import { Register } from "src/app/register/register";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Injectable({
    providedIn: 'root'
})

export class LoginService{
    
    constructor(private auth : Auth, private router:Router, private cookies:CookieService){ }

    users:User[]=[];
    email:string="";
    token:string="";

    signIn(reg:Register){
        return signInWithEmailAndPassword(this.auth,reg["email"],reg["password"]).then(
            response=> {  
                this.auth.currentUser?.getIdToken().then(
                    token=>{
                                this.token=token;
                                this.cookies.set("token", this.token);
                                this.cookies.set("email", reg["email"]);
                                this.router.navigate(['/']);
                            }
                )
          },
            error =>{
                alert(error);
                throw new(error);
            } 
        );
    }

    getIdToken(){
        return this.cookies.get("email");
    }

    logOut(){
        this.auth.signOut().then(()=>{
            this.token = "";
            this.email = "";
            this.cookies.set("token",this.token);
            this.cookies.set("email",this.email);
            this.router.navigate(['/login']);
        });
    }
}