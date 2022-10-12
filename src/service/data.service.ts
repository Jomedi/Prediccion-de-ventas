import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "src/app/user/user";

@Injectable()

export class DataService{

    constructor(private httpClient:HttpClient){
    }

    loadUsers(){
        return this.httpClient.get('https://prediccion-de-ventas-default-rtdb.europe-west1.firebasedatabase.app/usuarios.json');
    }

    saveUser(user:User){
        this.httpClient.post('https://prediccion-de-ventas-default-rtdb.europe-west1.firebasedatabase.app/usuarios.json', user).subscribe(
            response=>alert("Correct insertion: " + user.name),
            error=>alert("Error: " + error)
        );
    }
}