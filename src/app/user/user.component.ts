import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { DataService } from 'src/app/data/data.service';
import { LoginService } from '../login/login.service';
import {
  ScannerQRCodeConfig,
  ScannerQRCodeSelectedFiles,
  NgxScannerQrcodeService,
  ScannerQRCodeResult,
  NgxScannerQrcodeComponent,
  NgxScannerQrcodeModule
} from 'ngx-scanner-qrcode';
import { ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import * as Highcharts from 'highcharts';
import { Sale } from '../products/sales/sale';
import { Product } from '../products/product';


@Component({
  selector: 'app-user',
  template: ' <qr-code [value]="value" (decode)="onCodeDecode($event)"></qr-code>',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
  @ViewChild('closeButton') closeButton : any;

  //IDEA: Hacer una predicción de ventas estilo xray de amazon 
  //IDEA2: Hacer una predicción de ventas de "pronóstico de ventas"

  users:User[]=[]
  user:User = User.emptyUser()
  email:string=""
  profileImage:string = "/assets/images/profileImage.png"
  editing:Boolean = false
  value: string = ""
  sales: Sale[]=[]
  display:Boolean = false
  selectedDevice = 'rear'
  year:string = this.getActualYear().toString()
  result:ScannerQRCodeResult[]=[]
  ySales:Sale[]=[]

  minY:number=3000
  maxY:number=2000

  yearsOfSales:string[]=[]

  seasonal: number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  runRate: number[]=[0,0,0,0,0,0,0,0,0,0,0,0]
  runRateUnits: number[]=[0,0,0,0,0,0,0,0,0,0,0,0]
  allSalesInYear:number[]=[0,0,0,0,0,0,0,0,0,0,0,0]
  allUnitsInYear:number[]=[0,0,0,0,0,0,0,0,0,0,0,0]
  lastYearFactors:number[]=[0,0,0,0,0,0,0,0,0,0,0,0]
  seasonalLastYear:number[]=[0,0,0,0,0,0,0,0,0,0,0,0]

  productViews : any = []
  productNames:string[]=[]
  productChart:any=[]


  Highcharts: typeof Highcharts = Highcharts
  linechart: any = {
    series: [
      {
        name: this.year,
        data: this.allSalesInYear
      }
    ],
    chart: {
      type: 'column'
    },
    title: {
      text: 'Predicción de Ventas',
    },
    xAxis: {
      categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    },
    yAxis: {
        title: {
            text: 'Ventas €'
        }
    },
  }

  linechart2: any = {
    series: [
      {
        name: this.year,
        data: this.allUnitsInYear
      }
      // ,
      // {
      //   name: "RunRate",
      //   data: this.runRate,
      //   color: "#ADF056"
      // },
      // {
      //   name: "Seasonal",
      //   data: this.seasonal,
      //   color: "#EEBB4A"
      // }
    ],
    chart: {
      type: 'column',
    },
    title: {
      text: 'Unidades Vendidas',
    },
    xAxis: {
      categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    },
    yAxis: {
        title: {
            text: 'Unidades'
        }
    },
  }

  linechart3: any = {
    series: [
      {
        name: this.year,
        data: this.productChart
      }
    ],
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Visitas ',
    },
    xAxis: {
      categories: this.productNames
    },
    yAxis: {
        title: {
            text: 'Visitas a Productos'
        }
    },
  }
  

  constructor(private loginService : LoginService, private dataService: DataService, private router:Router, public cookie:CookieService) {
  }

  ngOnInit(): void {
    this.email = this.loginService.getIdToken()
    this.getUserData(this.email)
    // console.log(this.loginService.getIdToken());
    this.noLoginCase()
    this.loadSales()
    this.loadProducts()
    console.log("Linechart: ", this.linechart)
  }

  loadProducts(){
    this.dataService.loadProducts().subscribe(dbProducts=>{
      let products = Object.values(dbProducts)
      products.forEach(prod=>{
        let title = prod.title
        let views = 0

        if(prod.userViews)
          views = prod.userViews.length

        this.productChart.push({name: title ,y: views})
        this.productViews.push(views)
        this.productNames.push(title)
      })
      console.log("Products are: ", products)
    })
  }

  yearSales(year:string){
    console.log("This year sales: ", this.sales)

    this.ySales = this.sales.filter(sale=>{
      let y = "0"
      if (sale.date){ 
        let arrDate = sale.date.split("/")
        console.log("Date: ", arrDate)
        y = arrDate[2]
      }
      console.log("Date: ", sale.date)
      return year == y
    })

    console.log("yearSales", this.ySales)

    this.ySales.forEach(sale => {
      let arrDate = sale.date.split("/")
      let m = arrDate[1]
      this.allSalesInYear[parseInt(m) - 1] += sale.price * sale.quantity
    })

    console.log("allSalesInYear", this.allSalesInYear)
  }

  yearUnitsSold(year:string){
    console.log("This year sales: ", this.sales)

    this.ySales = this.sales.filter(sale=>{
      let y = "0"
      if (sale.date){ 
        let arrDate = sale.date.split("/")
        console.log("Date: ", arrDate)
        y = arrDate[2]
      }
      console.log("Date: ", sale.date)
      return year == y
    })

    console.log("yearSales", this.ySales)

    this.ySales.forEach(sale => {
      let arrDate = sale.date.split("/")
      let m = arrDate[1]
      this.allUnitsInYear[parseInt(m) - 1] += sale.quantity
    })

    console.log("allUnitsInYear", this.allUnitsInYear)
  }

  loadChart(disp:Boolean){
    this.display = disp
    this.yearSales(this.year)
    this.yearUnitsSold(this.year)
    this.runRateMethod()
    this.seasonalMethod()
    this.lastYearSeasonalMethod()
  }

  async startMethod(action : any){
    await action.start()
    if(action.devices && action.devices.length > 1)
      action.playDevice(action.devices.value[1])
  }

  loadSales(){
    this.dataService.loadSales().subscribe(dbSales =>{
      this.sales = Object.values(dbSales)
      console.log("Sales are: ", this.sales)
      this.getAllYears()
    })
  }

  getAllYears(){
    let minYear = this.minY
    let maxYear = this.maxY

    this.sales.forEach(sale=>{
      if(sale.date){
        let year = sale.date.split("/")[2]
        if(!this.yearsOfSales.includes(year)){
          this.yearsOfSales.push(year)
        }
      }
    })

    console.log(this.yearsOfSales)
  }

  runRateMethod(){
    let total = 0
    let totalUnits = 0
    let actualMonth = this.getActualMonth()
    let runRate: number[]=[0,0,0,0,0,0,0,0,0,0,0,0]
    let runRateUnits: number[]=[0,0,0,0,0,0,0,0,0,0,0,0]

    this.allSalesInYear.forEach(sale=>{
      total += sale
    })

    this.allUnitsInYear.forEach(unit=>{
      totalUnits += unit
    })

    console.log("Total: ", total)
    console.log("ActualMonth: ", actualMonth)

    //Number of sales per month
    let currentAvg = total / actualMonth
    let currentAvgUnits = totalUnits / actualMonth
    for(let i = 0; i < 12; i++){
      runRate[i] = currentAvg
      runRateUnits[i] = currentAvgUnits
    }

    this.runRate = runRate
    this.runRateUnits = runRateUnits

    this.linechart2.series.push({name: "RunRate", data: runRateUnits, type:"line"})
    this.linechart.series.push({name: "RunRate", data: runRate, type: "line"})
  } 

  lastYearSeasonalMethod(){
    let allSalesInYear=[0,0,0,0,0,0,0,0,0,0,0,0]
    let allUnitsInYear=[0,0,0,0,0,0,0,0,0,0,0,0]
    let seasonalLastYear = [0,0,0,0,0,0,0,0,0,0,0,0]
    let seasonalUnitsLastYear=[0,0,0,0,0,0,0,0,0,0,0,0]
    let lastYearFactors=[0,0,0,0,0,0,0,0,0,0,0,0]

    console.log("This year sales: ", this.sales)

    let lastySales = this.sales.filter(sale=>{
      let y = "0"
      if (sale.date){ 
        let arrDate = sale.date.split("/")
        console.log("Date: ", arrDate)
        y = arrDate[2]
      }
      console.log("Date: ", sale.date)
      return (parseInt(this.year) - 1).toString() == y
    })

    console.log("yearSales", this.ySales)

    let total = 0
    lastySales.forEach(sale => {
      total += sale.price*sale.quantity
      let arrDate = sale.date.split("/")
      let m = arrDate[1]
      allSalesInYear[parseInt(m) - 1] += sale.quantity * sale.price
      allUnitsInYear[parseInt(m) - 1] += sale.quantity
    })

    let i = 0
    allSalesInYear.forEach(sale=>{
      lastYearFactors[i] = (sale / total)
      i++
    })

    for(let i = this.getActualMonth(); i < 12; i++){
      seasonalLastYear[i] = lastYearFactors[i] * this.runRate[i] * 10
      seasonalUnitsLastYear[i] = lastYearFactors[i] * this.runRateUnits[i] * 10
    }

    this.linechart.series.push({name: "Seasonal(Last Year)", data: seasonalLastYear})
    this.linechart2.series.push({name: "Seasonal(Last Year)", data: seasonalUnitsLastYear})

    console.log("lastYearFactors: ", this.lastYearFactors)
  }

  seasonalMethod(){
    //Basado en datos de una tienda online real de Amazon Seller

    let seasonal: number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
    let seasonalUnits: number[] = [0,0,0,0,0,0,0,0,0,0,0,0]

    let actualMonth = this.getActualMonth()
    for(let i = actualMonth; i < 12; i++){
      let factor = 1

      if( i == 1){
        factor = 1
      }else if ( i == 2 ){
        factor = 0.8
      }else if ( i == 3 ){
        factor = 0.85
      }else if( i == 4 ){
        factor = 1.15
      }else if(i == 5){
        factor = 1
      }else if( i == 6){
        factor = 0.6
      }else if (i == 7){
        factor = 0.4
      }else if (i == 8){
        factor = 0.8
      }else if (i == 9){
        factor = 1
      }else if (i == 10){
        factor = 1.40
      }else if (i == 11){
        factor = 1.80
      }

      seasonal[i] = factor * this.runRate[i]
      seasonalUnits[i] = factor * this.runRateUnits[i]
    }
    this.linechart2.series.push({name: "Seasonal(Standard)", data: seasonalUnits, color: "#EEBB4A"})
    this.linechart.series.push({name: "Seasonal(Standard)", data: seasonal, color: "#EEBB4A"})
  }

  getActualMonth(){
    let date = this.getCurrentDate()
    let split = date.split("/")
    return parseInt(split[1])
  }

  getActualYear(){
    let date = this.getCurrentDate()
    let split = date.split("/")
    return parseInt(split[2])
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

  loadYear(i:string){
    this.year = i
    console.log(this.linechart)
  }

  stopMethod(action: any){
    action.stop()
  }

  onCodeDecodePrueba(){
    this.value = "http://localhost:4200/details/-NJ5xumjTKwKncj8iVkT"
    this.cookie.set("qrCode", this.value)
    this.closeButton.nativeElement.click()
    this.router.navigate([this.value.substring(22)])
  }

  onCodeDecode(result:ScannerQRCodeResult[], action : any) {
    this.result = result
    if (this.result && this.result.length > 0){
      this.cookie.set("qrCode",this.result[0].value.substring(22))
      this.closeButton.nativeElement.click()
      this.router.navigate([this.cookie.get("qrCode")])
    }
    if(action.devices && action.devices.length > 1)
      action.playDevice(action.devices.value[1])
    // if(this.result && this.result != null && result.length != 0){
    //   this.cookie.set("qrCode", result.toString())
    //   this.closeButton.nativeElement.click();
    //   this.stopMethod(action)
    // }
  }

  isUserAdmin(){
    return this.email === "a@a.es"
  }

  getUserData(email:string){
    this.dataService.loadUsers().subscribe(dbUsers=>{
      this.users = Object.values(dbUsers);
      for(let i = 0; i < this.users.length; i++){
        if(this.users[i].email == email){
          this.user = this.users[i];
        }
      }
    } );
    return this.user;
  }

  setEmail(email:string){
    this.email = email;
  }

  public logOut(){
    this.loginService.logOut();
  }

  routeToProducts(){
    this.router.navigate(['/products']);
  }

  routeToProfile(){
    this.router.navigate(['/profile']);
  }

  noLoginCase(){
    if(this.email.length < 3){
      this.router.navigate(['login']);
    }
  }

  isAdmin(){
    if(this.user.email === "a@a.es"){
      return true
    }
    else{
      return false
    }
  }
  
}