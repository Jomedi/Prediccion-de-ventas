import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data/data.service';
import { Product } from '../product';
// import { ProductsComponent } from '../products/products.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  products : Product[] = []
  product = Product.emptyProduct()

  constructor(private route: ActivatedRoute, private dataService:DataService, private router:Router) {
    this.route.params.subscribe(params=>{
      console.log(params['id'])
    })
  }

  ngOnInit(): void {
    this.getProductData()
  }

  getProductData(){
    this.dataService.loadProducts().subscribe(dbProducts=>{
      this.products = Object.values(dbProducts);
      console.log("Products: " + this.products.length)
      console.log(this.products)
      this.route.params.subscribe(params=>{
        console.log(params['id'])
        this.product = this.products[params['id']]
        console.log("Product caught: " + this.product.title)
      })
    } );
  }

}
