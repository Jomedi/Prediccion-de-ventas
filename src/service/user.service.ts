import { Injectable } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@angular/fire/auth";
import { DataService } from "./data.service";
import { User } from "src/app/user/user";
import { Register } from "src/app/register/register";


@Injectable({
    providedIn: 'root'
})

export class UserService{
    
    constructor(private auth : Auth, private dataService: DataService){ }

    register(reg:Register){
        return createUserWithEmailAndPassword(this.auth,reg["email"],reg["password"]);
    }

    signIn(reg:Register){
        return signInWithEmailAndPassword(this.auth,reg["email"],reg["password"]).then(
            response=>alert("Log in correcto " + reg["email"]),
            error => alert(error)
        )
    }

    writeUserData(user:User) {
        this.dataService.saveUser(user);
    }
}