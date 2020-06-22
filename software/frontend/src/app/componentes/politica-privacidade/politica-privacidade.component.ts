import { Component, OnInit } from '@angular/core';
import { TermosService } from '../../servicos/termos.service';

@Component({
  selector: 'app-politica-privacidade',
  templateUrl: './politica-privacidade.component.html',
  styleUrls: ['./politica-privacidade.component.scss']
})
export class PoliticaPrivacidadeComponent implements OnInit {

  public termos: any;
  public falhaReq: boolean;

  constructor(private termosService: TermosService) {

    this.termos = [];
    this.falhaReq = false;
   }

  ngOnInit( ) {
    this.termosService.obtemTermos('politica-privacidade-html').subscribe(
      resp => {
        if (resp !== null) {
          this.termos = resp;
          console.log(this.termos);
        }
      },
      erro => {
        console.log(erro);
        this.falhaReq = true;
       }
    );
  }

}
