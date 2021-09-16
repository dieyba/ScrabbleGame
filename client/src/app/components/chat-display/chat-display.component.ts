import { Component, OnInit } from '@angular/core';

const SYSTEM = "system";
const ADVERSARY = "adversary"
const PLAYER = "player"


@Component({
  selector: 'app-chat-display',
  templateUrl: './chat-display.component.html',
  styleUrls: ['./chat-display.component.scss']
})

export class ChatDisplayComponent implements OnInit {
  entries: ChatEntry[] = [];
  
  constructor() { }

  ngOnInit(): void {    
  }

  addPlayerEntry(isAdversary: boolean, playerMessage: string):void {
    this.entries.push({author: (isAdversary)? ADVERSARY: PLAYER, message:"player message" });
  }
  
  addError(errorMessage: string):void {
    this.entries.push({author:SYSTEM, message:"error message" });
  }


}

 interface ChatEntry {
  author: string
  message : string
}