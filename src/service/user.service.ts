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

    users:User[]=[];
    email:string="";

    register(reg:Register){
        return createUserWithEmailAndPassword(this.auth,reg["email"],reg["password"]);
    }

    signIn(reg:Register){
        return signInWithEmailAndPassword(this.auth,reg["email"],reg["password"]).then(
            response=> {  
          },
            error =>{
                alert(error);
                throw new(error);
            } 
        );
    }

    getUserData(){
        this.dataService.loadUsers().subscribe(users=>{console.log(users);
        this.users = Object.values(users);
        console.log(this.users);} );
    }

    writeUserData(user:User) {
        this.dataService.saveUser(user);
    }
}