import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Feedback } from './feedback';
import { DataService } from '../data/data.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  feedBack:Feedback = Feedback.emptyFeedback()
  allFeedbacks:Feedback[] = []

  constructor(private dataService : DataService) { }

  ngOnInit(): void {
    this.loadFeedbacks()
    // this.insertQuestion("¿Qué piensas del producto valoración?","val")
    // this.insertQuestion("¿Qué piensas del producto input?","text")
    // this.insertQuestion("¿Qué piensas del producto multivalor?","mul")
  }

  insertQuestion(title: string, type: string) {
    const pregunta = { title, type };
    this.feedBack.questions.push(pregunta);
  }

  addQuestion(ngForm : NgForm) {
    var formValue = ngForm.value
    this.insertQuestion(formValue.title,formValue.type)
  }

  saveFeedback(){
    //ALGO FALLA DE AQUÍ
    if(this.feedbackExists())
      this.dataService.updateFeedback(this.feedBack)
    else
      this.dataService.saveFeedback(this.feedBack)

    this.feedBack = Feedback.emptyFeedback()
  }

  loadFeedbacks(){
    this.dataService.loadFeedbacks().subscribe(feedbacksData =>{
      this.allFeedbacks =  Object.values(feedbacksData)
    })
  }

  loadFeedback(i : number){
    this.feedBack = this.allFeedbacks[i]
    console.log("These are all feedbacks: ", this.allFeedbacks)
    console.log(this.feedBack)
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

}
