import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data/data.service';
import { Product } from './product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(private dataService:DataService, private router:Router) { }

  product = Product.emptyProduct()
  products : Product[] = []
  add : boolean = false

  ngOnInit(): void {
    this.getProductData()
  }

  saveProduct(registerForm: NgForm) {
    var formValue = registerForm.value
    this.product = new Product(formValue["title"],formValue["description"],formValue["price"],formValue["img"].substring(12,formValue.length),"")
    
    this.dataService.saveProduct(this.product)
    registerForm.reset()
    this.getProductData()
    this.router.navigate(['/products'])
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