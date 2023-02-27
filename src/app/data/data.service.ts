import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "src/app/user/user";
import { LoginService } from "../login/login.service";
import { Product } from "../products/product";
import { Sale } from "../products/sales/sale";

@Injectable()

export class DataService{

    constructor(private httpClient:HttpClient, private loginService:LoginService){
    }

    loadProducts(){
        const token = this.loginService.getIdToken();
        return this.httpClient.get('https://prediccion-de-ventas-default-rtdb.europe-west1.firebasedatabase.app/productos.json?auth=' + token);
    }

    loadUsers(){
        const token = this.loginService.getIdToken();
        return this.httpClient.get('https://prediccion-de-ventas-default-rtdb.europe-west1.firebasedatabase.app/usuarios.json?auth=' + token);
    }

    loadSales(){
        const token = this.loginService.getIdToken();
        return this.httpClient.get('https://prediccion-de-ventas-default-rtdb.europe-west1.firebasedatabase.app/ventas.json?auth=' + token);
    }

    saveProduct(product:Product){
        this.httpClient.post('https://prediccion-de-ventas-default-rtdb.europe-west1.firebasedatabase.app/productos.json', product).subscribe(
            response=> {
                console.log("Correct register: " + product.title)
                // @ts-ignore
                product.key = response['name']
                this.updateProduct(product)
            },
            error=>console.error("Error saving user: " + product.title + ' -> ' + error)
        );
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

    saveSale(sale:Sale){
        this.httpClient.post('https://prediccion-de-ventas-default-rtdb.europe-west1.firebasedatabase.app/ventas.json', sale).subscribe(
            response=> {
                console.log("Correct sale save: " + sale.email + " " + sale.title + " " + sale.price)
                // @ts-ignore
                sale.key = response['name']
                this.updateSale(sale)
            },
            error=>console.error("Error saving sale: " + sale.email + " " + sale.title + " " + sale.price + " -> " + error)
        ); 
    }

    updateSale(sale:Sale){
        if(sale.key) {
            this.httpClient.put('https://prediccion-de-ventas-default-rtdb.europe-west1.firebasedatabase.app/ventas/' + sale.key + '/.json', sale).subscribe(
                response=>console.log("Correct sale update: " + sale.email + " " + sale.title + " " + sale.price),
                error=>console.error("Error updating sale: " + sale.email + " " + sale.title + " " + sale.price)
            );
        }else 
            alert("Trying to update with empty key for sale: " + sale.email + " " + sale.title + " " + sale.price)
    }

    updateProduct(product:Product){
        if(product.key) {
            this.httpClient.put('https://prediccion-de-ventas-default-rtdb.europe-west1.firebasedatabase.app/productos/' + product.key + '/.json', product).subscribe(
                response=>console.log("Correct update: " + product.title),
                error=>console.error("Error updating product: " + product.title + ' -> ' + error)
            );
        }else {
            alert("Trying to update with empty key for product: " + product.title)
        }
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

    deleteProduct(product:Product){
        this.httpClient.delete('https://prediccion-de-ventas-default-rtdb.europe-west1.firebasedatabase.app/productos/' + product.key + '/.json').subscribe(
            response=>console.log("Correct deletion of user " + product.title),
            error=>console.error("Error on user deletion: " + product.title + ' -> ' + error)
        ) ;
    }

    deleteUser(user:User){
        this.httpClient.delete('https://prediccion-de-ventas-default-rtdb.europe-west1.firebasedatabase.app/usuarios/' + user.key + '/.json').subscribe(
            response=>console.log("Correct deletion of user " + user.email),
            error=>console.error("Error on user deletion: " + user.email + ' -> ' + error)
        );
    }

    deleteSale(sale:Sale){
        this.httpClient.delete('https://prediccion-de-ventas-default-rtdb.europe-west1.firebasedatabase.app/ventas/' + sale.key + '/.json').subscribe(
            response=>console.log("Correct deletion of sale " + sale.email),
            error=>console.error("Error on user deletion: " + sale.email + ' -> ' + error)
        );
    }

}