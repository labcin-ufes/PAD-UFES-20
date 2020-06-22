import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  public flagFalha: boolean;

  constructor() {
    this.flagFalha = false;
  }

  ngOnInit() {

  }

  setFlagFalha(valor) {
    this.flagFalha = valor;
  }

}
