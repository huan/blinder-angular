import { Component, OnInit } from '@angular/core';
import { VERSION } from '../../config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = '脸盲助手 v' + VERSION
  constructor() { }

  ngOnInit() {
  }

}
