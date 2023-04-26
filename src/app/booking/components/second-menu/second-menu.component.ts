import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-second-menu',
  templateUrl: './second-menu.component.html',
  styleUrls: ['./second-menu.component.scss']
})
export class SecondMenuComponent implements OnInit {
  from: string;
  to: string;
  date: string;
  people: number;

  onClick() {
    this.from === 'From' ? this.from = 'To' : this.from = 'From';
    this.to === 'To' ? this.to = 'From' : this.to = 'To';
  }
  ngOnInit() {
    this.from = 'From';
    this.to = 'To';
    this.date = 'Date';
    this.people = 1;
  }


}
