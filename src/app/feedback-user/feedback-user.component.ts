import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../data/data.service';
import { User } from '../user/user';
import { Feedback } from '../feedback/feedback';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-feedback-user',
  templateUrl: './feedback-user.component.html',
  styleUrls: ['./feedback-user.component.css']
})
export class FeedbackUserComponent implements OnInit {

  constructor(private cookie: CookieService, private dataService: DataService) { }

  email:string=""
  users:User[]=[]
  user:User=User.emptyUser()
  feedbacks:Feedback[]=[]
  index:number=0
  table:string="Pendientes"
  pend = {}
  pendientes:Feedback[]=[]
  respondidos:Feedback[]=[]
  actualTable:Feedback[]=[]

  changeTable(){
    if(this.table == "Pendientes")
      this.table = "Respondidas"
    else
      this.table = "Pendientes"
    
    if(this.table == "Pendientes")
      this.actualTable = this.pendientes
    else
      this.actualTable = this.respondidos
  }

  loadTable(){
    let i = 0
    this.respondidos = []
    this.pendientes = []
    this.feedbacks.forEach(feed=>{
      if(this.user.feedbackDone[i]){
        this.respondidos.push(feed)
        console.log("Yes", i)
      }
      else if (!this.user.feedbackDone[i]){
        this.pendientes.push(feed)
        console.log("No", i)
      }
      i++
    })

    if(this.table == "Pendientes")
      this.actualTable = this.pendientes
    else
      this.actualTable = this.respondidos

    console.log("This user is: ", this.user)
  }

  feedbackOpened(title:string){
    let i = 0
    let index = 0
    this.feedbacks.forEach(feed => {
      if(feed.title == title)
        index = i
      i++
    })
    return this.user.feedbackOpened[index]
  }

  ngOnInit(): void {
    this.email = this.cookie.get("email")
    this.getUserData()
  }
  
  keepIndex(title:string){
    let i = 0
    this.feedbacks.forEach(feed => {
      if(feed.title == title)
        this.index = i
      i++
    })

    if(!this.user.feedbackOpened[this.index]){
      this.user.feedbackOpened[this.index] = true
      this.dataService.updateUser(this.user)
    }  
  }

  getUserData(){
    this.dataService.loadUsers().subscribe(dbUsers=>{
      this.users = Object.values(dbUsers)
      this.users.forEach(user=>{
        if(user.email == this.email)
          this.user = user
      })
      this.getFeedbackData()
    })
  }

  getFeedbackData(){
    this.dataService.loadFeedbacks().subscribe(dbFeed=>{
      this.feedbacks = Object.values(dbFeed)
      console.log("Shared feedbacks are: " + this.user.sharedFeedbacks)
      this.feedbacks = this.feedbacks.filter(feedback=>{
        return this.user.sharedFeedbacks.includes(feedback.title)
      })

      this.loadTable()

      console.log("Feedbacks: ", this.feedbacks)
      console.log("Pendientes: ", this.pendientes)
      console.log("Respondidos: ", this.respondidos)
      //FALTA elegir si es pendiente o respondido en caso de que sea cada uno
    })
  }

  formResponse(ngForm:NgForm){
    var formValue = ngForm.value 
    var list = []
    list.push(this.user.email)
    
    let i = 0
    this.feedbacks[this.index].questions.forEach(q=>{
      list.push(formValue[i])
      i++
    })

    if(!this.feedbacks[this.index].answers)
      this.feedbacks[this.index].answers=[]

    this.feedbacks[this.index].answers.push(list)

    this.user.feedbackDone[this.index] = true
    console.log("User data: ", this.user)
    
    this.loadTable()

    this.dataService.updateFeedback(this.feedbacks[this.index])
    this.dataService.updateUser(this.user)
    // this.user.feedbackDone
    // this.feedbacks[this.index].answers[answers].push
  }

  isUserAdmin(){
    return this.user.email == "a@a.es"
  }


}
