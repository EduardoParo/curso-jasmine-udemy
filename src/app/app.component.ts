import { Component, OnInit } from '@angular/core';

import { PoMenuItem, PoTableColumn } from '@po-ui/ng-components';
import { ViaCepService } from './shared/services/viacep.service';
import { TableService } from './shared/services/table.service';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  menus!: PoMenuItem[];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.menus = this.getMenus();
  }

  getMenus(): PoMenuItem[] {
    return [
      { label: 'Home', action: this.onClick.bind(this) },
      { label: 'ViaCep', action: this.onClick.bind(this) }
    ];
  }

  private onClick(res: any) {
    if(res.label === 'ViaCep'){
      this.router.navigate(['viacep']);
    }else{
      this.router.navigate(['']);
    }
  }



}
