import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from '../data/data.service';
import { Product } from './product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(private dataService:DataService) { }

  product = Product.emptyProduct()
  products : Product[] = []
  add : boolean = false

  ngOnInit(): void {
    this.getProductData()
  }

  saveProduct(registerForm: NgForm) {
    var formValue = registerForm.value
    this.product = new Product(formValue["title"],formValue["description"],formValue["price"],formValue["img"].substring(12,formValue.length),"")
    
    this.dataService.saveProduct(this.product);
    registerForm.reset();

  }

  newProduct() {
    this.product = new Product("mesa","desk for room",5,"no se","key")
    this.dataService.saveProduct(this.product);
  }

  getProductData(){
    this.dataService.loadProducts().subscribe(dbProducts=>{
      this.products = Object.values(dbProducts);
      console.log(this.products.length)
    } );
  }

  deleteProduct(title:string){
    let p = this.getProductByTitle(title)
    if (p != Product.emptyProduct()){
      this.dataService.deleteProduct(p)
    }
    this.getProductData()
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


}