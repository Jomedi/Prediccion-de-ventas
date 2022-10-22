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
            response=>alert("Correct insertion: " + user.name),
            error=>alert("Error: " + error)
        );
    }

    // deleteUser(user:User){
    //     this.httpClient.
    //     this.httpClient.delete('https://prediccion-de-ventas-default-rtdb.europe-west1.firebasedatabase.app/usuarios/', user).subscribe(
    //         response=>alert("Correct deletion"),
    //         error=>alert("Error: " + error)
    //     );
    // }

}