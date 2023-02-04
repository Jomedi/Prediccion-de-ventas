import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';
import { getDownloadURL, listAll } from 'firebase/storage';
import { DataService } from 'src/app/data/data.service';
import { Product } from 'src/app/products/product';
import { User } from '../user';
import { waitForAsync } from '@angular/core/testing';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit {

  constructor(private dataService:DataService, private router:Router, private cookie:CookieService, private storage:Storage) { }

  products : Product[] = []
  favouriteProducts : string[] = []
  add : boolean = false

  ngOnInit(): void {
    this.getFavouriteProducts()
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
          let product = new Product(formValue["title"],formValue["description"],formValue["price"],url,"")
          this.dataService.saveProduct(product)
          registerForm.reset()
          this.getFavouriteProducts()
          this.router.navigate(['/products'])
        }
      }
      })
    .catch(error => console.log(error))

  }

  addFavouriteProduct(productKey:string){
    let user = this.userSession()
    user.favourite_products.push(productKey)
    this.dataService.updateUser(user)
  }

  getFavouriteProducts(){
    this.favouriteProducts = this.cookie.get("favouriteProducts").split(",")
    if(this.favouriteProducts.length > 0){
      this.dataService.loadProducts().subscribe(dbProducts=>{
        this.products = Object.values(dbProducts);
        this.products = this.products.filter(product=>{
          return this.favouriteProducts.includes(product.key)
        })
        console.log("Los productos favoritos son: " , this.products)
      });
    }
  }

  deleteFavouriteProduct(productKey:string){
    let user = this.userSession()
    this.favouriteProducts = user.favourite_products
    this.favouriteProducts = this.favouriteProducts.filter(prod=>{
      return prod != productKey
    })
    this.cookie.set("favouriteProducts", this.favouriteProducts.toString())
    user.favourite_products = this.favouriteProducts
    this.dataService.updateUser(user)
  }

  userSession(){
    return new User(this.cookie.get("email"), this.cookie.get("name"), this.cookie.get("date"), this.cookie.get("address"), 
                    this.cookie.get("gender"), this.cookie.get("password"),this.cookie.get("key") ,this.cookie.get("favouriteProducts").split(","))
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
    this.getFavouriteProducts()
    return this.products[i]
  }

}
