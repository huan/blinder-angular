import { Component } from '@angular/core'

import { VERSION } from '../config'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Blinder v' + VERSION
}
