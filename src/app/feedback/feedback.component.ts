import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Feedback } from './feedback';
import { DataService } from '../data/data.service';
import { User } from '../user/user';
import { Product } from '../products/product';

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

  constructor(private dataService : DataService) { }

  ngOnInit(): void {
    this.loadAllFeedbacks()
    this.getUserData()
    this.getProductData()
  }

  insertQuestion(title: string, type: string) {
    const pregunta = { title, type }
    this.feedBack.questions.push(pregunta)
  }

  insertUser(ngForm : NgForm){
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
      console.log("Users to share with: ", this.users)
      this.users.forEach(user=>{
        if(!user.sharedFeedbacks)
          user.sharedFeedbacks = []

        user.sharedFeedbacks.push(this.feedBack.title)
      })
      this.users.forEach(user => {
        this.dataService.updateUser(user)
      })
    }
  }

  insertTitle(title: string) {
    let exists = false
    this.allFeedbacks.forEach(feed=>{
      if(feed.title == title)
        exists = true
    })
    if(!exists)
      this.feedBack.title = title
    else
      alert("El título '" + title + "' ya existe para otra encuesta") 
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
    this.insertTitle(formValue.title)
  }

  saveFeedback(){
    if(this.feedbackExists())
      this.dataService.updateFeedback(this.feedBack)
    else
      this.dataService.saveFeedback(this.feedBack)

    this.allFeedbacks.push(this.feedBack)
    this.feedBack = Feedback.emptyFeedback()
  }

  loadAllFeedbacks(){
    this.dataService.loadFeedbacks().subscribe(feedbacksData =>{
      this.allFeedbacks =  Object.values(feedbacksData)
    })
  }

  deleteFeedback(i : number){
    let feed = this.allFeedbacks[i]

    this.allFeedbacks = this.allFeedbacks.filter(fb=>{
      return fb.key != feed.key
    })

    this.dataService.deleteFeedback(feed)
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
