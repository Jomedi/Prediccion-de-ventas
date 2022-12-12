import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../data/data.service';
import { Product } from './product';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';
import { getDownloadURL, listAll } from 'firebase/storage';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(private dataService:DataService, private router:Router, private cookie:CookieService, private storage:Storage) { }

  product = Product.emptyProduct()
  products : Product[] = []
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

  getProductData(){
    this.dataService.loadProducts().subscribe(dbProducts=>{
      this.products = Object.values(dbProducts);
      console.log("Products: " + this.products.length)
    } );
  }

  deleteProduct(title:string){
    let p = this.getProductByTitle(title)
    if (p != Product.emptyProduct()){
      this.dataService.deleteProduct(p)
      this.getProductData()
      this.router.navigate(['/products'])
    }
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


}