import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { deleteUser } from "firebase/auth";
import { User } from "src/app/user/user";
import { LoginService } from "../login/login.service";

@Injectable()

export class DataService{

    constructor(private httpClient:HttpClient, private loginService:LoginService){
    }

    loadUsers(){
        const token = this.loginService.getIdToken();
        return this.httpClient.get('https://prediccion-de-ventas-default-rtdb.europe-west1.firebasedatabase.app/usuarios.json?auth=' + token);
    }

    saveUser(user:User){
        this.httpClient.post('https://prediccion-de-ventas-default-rtdb.europe-west1.firebasedatabase.app/usuarios.json', user).subscribe(
            response=> {
                console.log("Correct register: " + user.email)
                // @ts-ignore
                user.key = response['name']
                this.updateUser(user)
            },
            error=>console.error("Error saving user: " + user.email + ' -> ' + error)
        );
    }

    updateUser(user:User){
        if(user.key) {
            this.httpClient.put('https://prediccion-de-ventas-default-rtdb.europe-west1.firebasedatabase.app/usuarios/' + user.key + '/.json', user).subscribe(
                response=>console.log("Correct update: " + user.email),
                error=>console.error("Error updating user: " + user.email + ' -> ' + error)
            );
        }else {
            alert("Trying to update with empty key for user: " + user)
        }
    }

    deleteUser(user:User){
        this.httpClient.delete('https://prediccion-de-ventas-default-rtdb.europe-west1.firebasedatabase.app/usuarios/' + user.key + '/.json').subscribe(
            response=>console.log("Correct deletion of user " + user.email),
            error=>console.error("Error on user deletion: " + user.email + ' -> ' + error)
        );
    }

}