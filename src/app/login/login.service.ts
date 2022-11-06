import { Injectable } from "@angular/core";
import { Auth, signInWithEmailAndPassword, EmailAuthProvider } from "@angular/fire/auth";
import { User } from "src/app/user/user";
import { Register } from "src/app/register/register";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import {reauthenticateWithCredential} from "@firebase/auth";
import {deleteUser} from "firebase/auth";

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
                alert(error)
                console.error(error);
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

    delUser(user: User, reAuthenticated = true){
        //this.auth.currentUser?.delete()
        let currentUser = this.auth.currentUser!;
        deleteUser(currentUser).then(
            response=>{
                console.log("Properly deleted auth user: " + user.email)
                this.router.navigate(['/login'])
            },
            error=>{
                if (reAuthenticated) {
                    console.error("Error deleting auth user " + user.email + ' -> ' + error)
                }else {
                    let authCredential = EmailAuthProvider.credential(user.email, user.password);
                    reauthenticateWithCredential(currentUser, authCredential).then(
                        response => {
                            console.log("Properly reAuthenticated: " + response)
                            this.delUser(user)
                        },
                        error => console.error("Error reAuthenticating: " + error)
                    )
                }
            }
        );
    }
}