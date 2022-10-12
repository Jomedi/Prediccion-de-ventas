import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { UserService } from 'src/service/user.service';
import { DataService } from 'src/service/data.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
  users:User[]=[];
  user:User = new User("","","","","");

  constructor(private uS : UserService, private dataService: DataService) { 

  }

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData(){
    this.dataService.loadUsers().subscribe(users=>{console.log(users);
    this.users = Object.values(users);
    console.log(this.users);} );
  }
}


