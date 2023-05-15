import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

export type EditorType = 'register' | 'login' | 'user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  // editor: EditorType = 'login';


  // get showRegisterEditor(){
  //   return this.editor === 'register';
  // }

  // get showLoginEditor(){
  //   return this.editor === 'login';
  // }

  // get showUserEditor(){
  //   return this.editor === 'user';
  // }

  // public toggleEditor(type: EditorType) {
  //   this.editor = type;
  // }
}

