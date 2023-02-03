import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';
import { getDownloadURL, listAll } from 'firebase/storage';
import { DataService } from 'src/app/data/data.service';
import { Product } from 'src/app/products/product';
import { User } from '../user';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit {

  constructor(private dataService:DataService, private router:Router, private cookie:CookieService, private storage:Storage) { }

  product = Product.emptyProduct()
  products : Product[] = []
  favourites : string[] = []
  users : User[] = []
  add : boolean = false

  ngOnInit(): void {
    this.getProductData()
  }

  uploadImage($event:any){
    const file = $event.target.files[0]
    console.log("File: ", file)

    const imgRef = ref(this.storage, `images/${file.name}`)

    uploadBytes(imgRef, file)
    .then(response => console.log(response))
    .catch(error => console.log(error))
  }

  getImageByName(name:string){
    const imagesRef = ref(this.storage, 'images')
  }

  isUserAdmin(){
    if(this.cookie.get("email") == "a@a.es")
      return true
    else 
      return false
  }

  saveProduct(registerForm: NgForm) {
    const imagesRef = ref(this.storage, 'images')
    var formValue = registerForm.value

    let image = formValue["img"].substring(12,formValue.length)

    listAll(imagesRef)
    .then(async response => {
      for(let item of response.items){
        console.log(item.name + "==" + image)
        if (item.name == image){
          const url = await getDownloadURL(item)
          this.product = new Product(formValue["title"],formValue["description"],formValue["price"],url,"")
          this.dataService.saveProduct(this.product)
          registerForm.reset()
          this.getProductData()
          this.router.navigate(['/products'])
        }
      }
      })
    .catch(error => console.log(error))

  }

  addFavouriteProduct(productKey:string){
    this.dataService.loadUsers().subscribe(user=>{
      let users = Object.values(user)
      users.forEach(user => {
        if(user.email == this.cookie.get("email")){
          user.favourite_products.push(productKey)
          this.dataService.updateUser(user)
        }
      });
    })
  }

  getProductData(){
    this.dataService.loadUsers().subscribe(user=>{
      this.users = Object.values(user)
      this.users.forEach(user => {
        if(user.email == this.cookie.get("email")){
          this.favourites = user.favourite_products
        }   
      });
      if(this.favourites.length > 0){
        this.dataService.loadProducts().subscribe(dbProducts=>{
          this.products = Object.values(dbProducts);
          this.products = this.products.filter(product=>{
            return this.favourites.includes(product.key)
          })
          console.log("Los productos favoritos son: " , this.products)
        });
      }
    })
  }

  deleteProduct(productKey:string){
    this.dataService.loadUsers().subscribe(user=>{
      let users = Object.values(user)
      users.forEach(user => {
        if(user.email == this.cookie.get("email")){
          this.favourites = user.favourite_products
          this.favourites = this.favourites.filter(prod=>{
            console.log(prod, " != ", productKey)
            return prod != productKey
          })
          user.favourite_products = this.favourites
          this.dataService.updateUser(user)
          this.getProductData()
          this.router.navigate(['/favourites'])
        }
      });
    })
  }

  getProductByTitle(title:string){
    let p = Product.emptyProduct()
    this.products.forEach(prod => {
      if(prod.title == title){
        p = prod
      }
    });
    return p;
  }

  setAdd(){
    this.add = !this.add;
  }

  getProductByIndex(i:number){
    this.getProductData()
    return this.products[i]
  }



  deleteFavourite(){

  }

}
