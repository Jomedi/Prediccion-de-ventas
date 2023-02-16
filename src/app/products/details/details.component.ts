import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data/data.service';
import { Product } from '../product';
import { SafeUrl } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
// import { ProductsComponent } from '../products/products.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  valorations : string[] = ["","","","",""]
  products : Product[] = []
  product = Product.emptyProduct()
  avgRating : number = -1

  id: number = 0;
  public myAngularxQrCode: string = "";
  public qrCodeDownloadLink: SafeUrl = "";

  constructor(private route: ActivatedRoute, private dataService:DataService, private router:Router, private cookie:CookieService) {
    this.route.params.subscribe(params=>{
      console.log(params['id'])
    })
  }

  buttonAvailable(id : number){
    return this.cookie.get('email') === 'a@a.es' || this.cookie.get('email') === this.product.userRating[id]
  }

  openModal(id: number) {
    this.id = id;
    console.log(this.id)
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
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
        this.product = this.searchProductByKey(params['id'])
        console.log("Product caught: " + this.product.title)
        this.myAngularxQrCode = 'http://localhost:4200/details/' + this.product.key;
        console.log("URL: " + this.myAngularxQrCode)
        console.log(params)
        this.calculateThisAverage()
      })
    } );
  }

  calculateThisAverage(){
    this.avgRating = this.calculateProductAverage(this.product)
  }

  calculateProductAverage(product:Product){
    let sum = 0
    let avg = 0

    if(product.rating && product.rating.length > 0){
      product.rating.forEach(rate=>{
        let number = +rate
        sum += number
      })
      avg = sum / product.rating.length
    }

    return avg
  }


  deleteReview(){
    this.product.userRating.splice(this.id, 1);
    this.product.rating.splice(this.id,1)
    this.product.comment.splice(this.id,1)
    this.product.ratingDate.splice(this.id,1)
    this.dataService.updateProduct(this.product)
  }

  modifyReview(registerMod: NgForm){
    var formValue = registerMod.value
    this.product.rating[this.id] = formValue.rating
    this.product.comment[this.id] = formValue.comment
    if(formValue.rating && formValue.comment)
      this.dataService.updateProduct(this.product)
    registerMod.reset()
  }

  searchProductByKey(key:string){
    let prod = Product.emptyProduct()
    this.products.forEach(p =>{
      if(p.key == key)
        prod = p
    })
    return prod
  }

  saveReview(registerForm: NgForm){
    var formValue = registerForm.value
    console.log("Formvalue: ", formValue)

    //userRating
    if(!this.product.userRating || this.product.userRating.length == 0)
      this.product.userRating = []

    console.log(this.cookie.get("email"))
    this.product.userRating.push(this.cookie.get("email"))


    //rating
    if(!this.product.rating || this.product.rating.length == 0)
      this.product.rating = []

    console.log(formValue["rating"])
    this.product.rating.push(formValue["rating"])
    

    //comment
    if(!this.product.comment || this.product.comment.length == 0)
      this.product.comment = []

    console.log(formValue["comment"])
    this.product.comment.push(formValue["comment"])

    //date
    if(!this.product.ratingDate || this.product.ratingDate.length == 0)
      this.product.ratingDate = []
    
    console.log(this.getCurrentDate())
    this.product.ratingDate.push(this.getCurrentDate())

    // update rating
    console.log("this product: ", this.product)
    this.dataService.updateProduct(this.product)
  }

  getCurrentDate(){
    const date = new Date()
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = ""
    if(month < 10)
      currentDate = `${day}/0${month}/${year}`;
    else
      currentDate = `${day}/${month}/${year}`;

    return currentDate
  }

  async viewDetails(key:string){
    await this.router.navigate(['/details/' + key])
    window.location.reload()
  }
}
