import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  preguntas:any = []
  constructor() { }

  ngOnInit(): void {
    this.insertQuestion("Qué piensas del producto valoración?","val")
    this.insertQuestion("Qué piensas del producto input?","text")
    this.insertQuestion("Qué piensas del producto multivalor?","mul")
  }

  insertQuestion(titulo: string, tipo: string) {
    const pregunta = { titulo, tipo };
    this.preguntas.push(pregunta);
  }

  addQuestion(ngForm : NgForm) {
    var formValue = ngForm.value
    this.insertQuestion(formValue.title,formValue.type)
    console.log("formvalue is: ", formValue.title)
  }

}
