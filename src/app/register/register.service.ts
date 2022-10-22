import { Injectable } from "@angular/core";
import { Auth, createUserWithEmailAndPassword} from "@angular/fire/auth";
import { Register } from "src/app/register/register";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class RegisterService{
    
    constructor(private auth : Auth, private router:Router){ }

    register(reg:Register){
        return createUserWithEmailAndPassword(this.auth,reg["email"],reg["password"]).then(
            response=>{
                this.router.navigate(['/login']);
            }
        );
    }

}