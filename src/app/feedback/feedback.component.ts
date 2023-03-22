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

  constructor(private dataService : DataService) { }

  ngOnInit(): void {
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
    this.dataService.saveFeedback(this.feedBack)
    this.feedBack = Feedback.emptyFeedback();
  }

}
