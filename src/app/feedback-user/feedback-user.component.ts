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
  ind:number=0
  indPendientes:number=0
  indRespondidas:number=0
  ansInd:number=0
  table:string="Pendientes"
  pend = {}
  pendientes:Feedback[]=[]
  respondidos:Feedback[]=[]
  actualTable:Feedback[]=[]
  answers:any[]=[]

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

    this.feedbackAnswers()
    console.log("This user is: ", this.user)
  }

  feedbackAnswers(){
    this.respondidos.forEach(respuesta=>{
      respuesta.answers.forEach(answer=>{
        if(answer && answer[0] == this.cookie.get("email"))
          this.answers.push(answer)
      })
    })

    console.log("this pendientes: ", this.pendientes)
    console.log("this respondidos: ", this.respondidos)
    console.log("this answers: ", this.answers)
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
      if(feed.title == title){
        this.ind = i
        if(feed.answers){
          feed.answers.forEach(answer=>{
            let j = 0
            if(answer[0] == this.cookie.get("email"))
              this.ansInd = j
              j++
          })
        }  
      } 
      i++
    })

    console.log("This ind: ", this.ind)
    console.log("Ans ind: ", this.ansInd)

    if(!this.user.feedbackOpened[this.ind]){
      this.user.feedbackOpened[this.ind] = true
      this.dataService.updateUser(this.user)
    }  
  }

  keepIndexPendientes(title:string){
    let i = 0
    this.pendientes.forEach(feed=>{
      if(feed.title == title)
        this.indPendientes = i
      i++
    }) 
    console.log("Index pendientes: ", this.indPendientes)
    this.keepIndex(title)
  }

  keepIndexRespondidas(title:string){
    
    let i = 0
    this.respondidos.forEach(feed=>{
      if(feed.title == title)
        this.indRespondidas = i
      i++
    })
    console.log("Index respondidas: ", this.indRespondidas)
    this.keepIndex(title)
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
      console.log("All feedbacks are: " + this.feedbacks)
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
    this.feedbacks[this.ind].questions.forEach(q=>{
      list.push(formValue[i])
      i++
    })

    if(!this.feedbacks[this.ind].answers)
      this.feedbacks[this.ind].answers=[]

    this.feedbacks[this.ind].answers.push(list)

    this.user.feedbackDone[this.ind] = true
    console.log("User data: ", this.user)
    
    this.loadTable()

    this.dataService.updateFeedback(this.feedbacks[this.ind])
    this.dataService.updateUser(this.user)
    // this.user.feedbackDone
    // this.feedbacks[this.index].answers[answers].push
  }

  isUserAdmin(){
    return this.user.email == "a@a.es"
  }


}
