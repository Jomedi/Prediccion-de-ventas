import { Component } from '@angular/core';

export type EditorType = 'register' | 'login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  editor: EditorType = 'login';


  get showRegisterEditor(){
    return this.editor === 'register';
  }

  get showLoginEditor(){
    return this.editor === 'login';
  }

  public toggleEditor(type: EditorType) {
    this.editor = type;
  }
}
