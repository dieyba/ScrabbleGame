import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-text-entry',
  templateUrl: './text-entry.component.html',
  styleUrls: ['./text-entry.component.scss']
})
export class TextEntryComponent implements OnInit {
  buttonPressed = '';

  constructor() { }

  @HostListener('window:keydown', ['$event'])
  buttonDetect(event: KeyboardEvent) {
      this.buttonPressed += event.key;
  }



  ngOnInit(): void {
      this.buttonPressed = '';
  }

}
