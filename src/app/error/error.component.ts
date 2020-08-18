import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  message:string = 'An unkwon error';
  constructor() { }

  ngOnInit(): void {
  }

}
