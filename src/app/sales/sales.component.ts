import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data/data.service';
import { Sale } from './sale';
import { Product } from '../products/product';
import { User } from 'src/app/user/user';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

  constructor(private dataService: DataService, private cookie: CookieService) { }

  id : number = -1
  sales : Sale[] = []
  filteredSales:Sale[]=[]
  products : Product[] = []
  users: User[] = []
  total : number = 0
  totalUnits : number = 0
  years: number [] = []
  year: number = -1

  price:number=0
  quantity:number=1

  months: string[]=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

  ngOnInit(): void {
    if(this.isUserAdmin()){
      this.getAllSales()
      this.getAllProducts()
      this.getAllUsers()
    }else
      this.getUserSales()
  }

  onChange(deviceValue:any) {
    console.log(deviceValue);
  }

  filterSales(year : number){
    this.year = year
    if(year != -1){
      this.filteredSales = this.sales.filter(sale=>{
        return parseInt(sale.date.split("/")[2]) == year
      })
    }else
      this.filteredSales = this.sales

    this.calculateTotalEarned()
  }

  filterSalesMonth(month:number){
    if(month == -1){
      this.filteredSales = this.sales.filter(sale=>{
        return parseInt(sale.date.split("/")[2]) == this.year
      })
    }else{
      this.filteredSales = this.sales.filter(sale=>{
        return parseInt(sale.date.split("/")[2]) == this.year && parseInt(sale.date.split("/")[1]) == month + 1
      })
    }

    this.calculateTotalEarned()
  }

  getOption() {
    console.log(document.getElementById('title'));
  }

  set value_(title:string){
    let prods = this.products.filter(prod=>{
      return prod.title = title
    })
    this.price = prods[0].price
  }

  setPrice(price:any){
    this.price = price
    console.log(this.price)
  }

  registerNewSale(salesForm:NgForm){
    var formValue = salesForm.value
    let sale = Sale.emptySale()
    let product = this.products.filter(prod =>{
      return prod.title == formValue.title
    })

    sale.date = this.getCurrentDate()
    sale.email = formValue.email
    sale.quantity = formValue.quantity

    sale.title = formValue.title
    sale.price = product[0].price
    sale.product_key = product[0].key

    this.dataService.saveSale(sale)
    this.sales.push(sale)
    this.calculateTotalEarned()
  }

  modifySale(salesForm:NgForm){
    var formValue = salesForm.value
    let sale = this.sales[this.id] 

    if(formValue.email)
      sale.email = formValue.email

    if(formValue.quantity)
      sale.quantity = formValue.quantity

    if(formValue.title){
      let product = this.products.filter(prod =>{
        return prod.title == formValue.title
      })
      sale.title = formValue.title
      sale.price = product[0].price
      sale.product_key = product[0].key
    }

    this.dataService.updateSale(sale)
    this.sales[this.id] = sale
    this.calculateTotalEarned()
  }

  deleteSale(){
    let sale = this.sales[this.id]
    this.dataService.deleteSale(sale)
    this.sales.splice(this.id, 1)
    this.calculateTotalEarned()
  }

  getAllSales(){
    this.dataService.loadSales().subscribe(dbProducts=>{
      this.sales = Object.values(dbProducts)
      this.filteredSales = this.sales
      this.calculateTotalEarned()
      this.getAllYears()
    })
  }

  getAllYears(){
    this.sales.forEach(sale=>{
      let year = parseInt(sale.date.split("/")[2])
      if(!this.years.includes(year))
        this.years.push(year)
    })
  }

  calculateTotalEarned(){
    this.total = 0
    this.totalUnits = 0
    this.filteredSales.forEach(sale=>{
      this.total += (sale.price * sale.quantity)
      this.totalUnits += sale.quantity
    })
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

  getAllProducts(){
    this.dataService.loadProducts().subscribe(dbProducts =>{
      this.products = Object.values(dbProducts)
    })
  }

  getAllUsers(){
    this.dataService.loadUsers().subscribe(dbProducts =>{
      this.users = Object.values(dbProducts)
    })
  }

  getUserSales(){
    this.dataService.loadSales().subscribe(dbProducts=>{
      this.sales = Object.values(dbProducts)
      this.sales = this.sales.filter(sale=>{
        return sale.email == this.cookie.get("email")
      })
      this.calculateTotalEarned()
    })    
  }

  openModal(id: number) {
    this.id = id;
  }

  isUserAdmin(){
    return this.cookie.get("email") == "a@a.es"
  }
}
