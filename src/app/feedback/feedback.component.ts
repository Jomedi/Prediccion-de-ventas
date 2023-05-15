import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Feedback } from './feedback';
import { DataService } from '../data/data.service';
import { User } from '../user/user';
import { Product } from '../products/product';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  feedBack:Feedback = Feedback.emptyFeedback()
  allFeedbacks:Feedback[] = []
  users:User[] = []
  products:Product[] = []
  table:string="crear"
  answeredFeedbacks:Feedback[]=[]
  feedbackAns:Feedback= Feedback.emptyFeedback()
  answer:string[]=[]
  index:number = 0

  constructor(private dataService : DataService, private cookie:CookieService) { }

  ngOnInit(): void {
    this.loadAllFeedbacks()
    this.getUserData()
    this.getProductData()
    this.loadAllAnsweredFeedbacks()
  }

  loadAnswer(answer:string[]){
    this.answer = answer
  }

  isUserAdmin(){
    return this.cookie.get("email") == "a@a.es"
  }

  getIndex(index:number){
    this.index = index
  }

  changeTable(){
    if(this.table == "crear")
      this.table = "respuestas"
    else
      this.table = "crear"
  }

  loadFeedbackAns(i:number){
    this.answer = []
    this.feedbackAns = this.answeredFeedbacks[i]
    console.log("These are all feedbacks: ", this.answeredFeedbacks)
    console.log(this.feedBack)
    console.log(this.feedBack.questions.length)
  }

  insertQuestion(title: string, type: string) {
    const pregunta = { title, type }
    this.feedBack.questions.push(pregunta)
  }

  insertTitle(title: string, description: string) {
    let exists = false
    this.allFeedbacks.forEach(feed=>{
      if(feed.title == title)
        exists = true
    })
    if(!exists){
      this.feedBack.title = title
      this.feedBack.description = description
    }
      
    else
      alert("El título '" + title + "' ya existe para otra encuesta") 
  }

  publishFeedback(ngForm : NgForm){
    var emails = ngForm.value.emails
    console.log(emails)
    if(emails){
      if(emails != "allUsers"){
        let product = Product.emptyProduct()
        this.products.forEach(prod =>{
          if(prod.key == emails)
            product = prod
        })
        this.users = this.users.filter(user=>{
          return product.userViews.includes(user.email)
        })
        console.log("Users with views in product: ", this.users)
      }
      this.users.forEach(user=>{
        if(!user.sharedFeedbacks)
          user.sharedFeedbacks = []
        if(!user.publishDate)
          user.publishDate = []
        if(!user.feedbackDone)
          user.feedbackDone = []
        if(!user.feedbackOpened)
          user.feedbackOpened = []
        user.sharedFeedbacks.push(this.feedBack.title)
        user.feedbackDone.push(false)
        user.feedbackOpened.push(false)
        this.feedBack.publishDate = this.getCurrentDate()
      })
      console.log("Users to share with: ", this.users)
      this.users.forEach(user => {
        this.dataService.updateUser(user)
      })
    }
  }

  publish(ngForm:NgForm){
    this.publishFeedback(ngForm)
    this.saveFeedback()
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

  getUserData(){
    this.dataService.loadUsers().subscribe(dbUsers=>{
      this.users = Object.values(dbUsers)
    })
  }

  getProductData(){
    this.dataService.loadProducts().subscribe(dbProducts=>{
      this.products = Object.values(dbProducts)
    })
  }

  addQuestion(ngForm : NgForm) {
    var formValue = ngForm.value
    this.insertQuestion(formValue.title,formValue.type)
  }

  addTitle(ngForm : NgForm) {
    var formValue = ngForm.value
    console.log(formValue.title)
    this.insertTitle(formValue.title, formValue.description)
  }

  saveFeedback(){
    if(this.feedbackExists())
      this.dataService.updateFeedback(this.feedBack)
    else
      this.dataService.saveFeedback(this.feedBack)

    this.allFeedbacks.push(this.feedBack)
  }

  loadAllFeedbacks(){
    this.dataService.loadFeedbacks().subscribe(feedbacksData => {
      this.allFeedbacks =  Object.values(feedbacksData)
      this.allFeedbacks = this.allFeedbacks.filter(feedback=>{
        return feedback.saved
      })
    })
  }

  loadAllAnsweredFeedbacks(){
    this.dataService.loadFeedbacks().subscribe(feedData => {
      this.answeredFeedbacks = Object.values(feedData)
      this.answeredFeedbacks = this.answeredFeedbacks.filter(feed=>{
        return feed.answers && feed.answers.length > 0
      })
    })
  }

  deleteFeedback(i : number){
    let feed = this.allFeedbacks[i]

    this.allFeedbacks = this.allFeedbacks.filter(fb=>{
      return fb.key != feed.key
    })

    feed.saved = false

    this.dataService.updateFeedback(feed)
  }

  loadFeedback(i : number){
    this.feedBack = this.allFeedbacks[i]
    console.log("These are all feedbacks: ", this.allFeedbacks)
    console.log(this.feedBack)
    console.log(this.feedBack.questions.length)
  }

  feedbackExists(){
    let found = false
    this.allFeedbacks.forEach(fb=>{
      if(fb.key == this.feedBack.key){
        found = true
      }   
    })
    return found
  }

  setEmptyFeedback(){
    this.feedBack = Feedback.emptyFeedback()
  }

  reloadPage(){
    window.location.reload()
  }

}
