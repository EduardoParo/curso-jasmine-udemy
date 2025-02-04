import { Component, Injectable, Injector, OnInit } from '@angular/core';

import { PoMenuItem, PoTableColumn } from '@po-ui/ng-components';
import { Subscription, debounceTime, distinctUntilChanged, filter, finalize } from 'rxjs';
import { Router } from '@angular/router';
import { ViaCepService } from '../../shared/services/viacep.service';
import { TableService } from '../../shared/services/table.service';
import { BaseResourceComponent } from '../../shared/components/base-resource.component';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-via-cep',
  templateUrl: './via-cep.component.html',
})
export class ViaCepComponent extends BaseResourceComponent implements OnInit {
  infoPage!: string;
  resApi!: string;
  formGroup!: UntypedFormGroup;
  searchInput$!: Subscription;

  constructor(
    private viaCepService: ViaCepService,
    private tableService: TableService,
    private formBuilder: UntypedFormBuilder,
    override injector: Injector
  ) {
    super(injector, 'VIACEP');
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.onInitColumns();
    this.onInitItems();
    this.onInitForm();
  }

  getAppName(): string {
    return 'FORMAÇÃO JASMINE';
  }

  showLoading(isShow: boolean): boolean {
    if (isShow) {
      this.resApi = 'Carregando os dados da API';
      this.isLoading = isShow;
    } else {
      this.isLoading = isShow;
    }

    return this.isLoading;
  }

  getMenus(): PoMenuItem[] {
    return [
      { label: 'Home', action: this.onClick.bind(this) }
    ];
  }

  async onInitColumns(): Promise<void> {
    const listColumns = await this.tableService.getColumnsViaCeep();
    this.columns = listColumns.map(i => ({ property: i }));
  }

  onClick() {
    this.router.navigate(['pokemon']);
  }

  setResAPI(res: any): void {
    this.resApi = JSON.stringify(res);
  }

  onInitItems(cep = '01001000'): void {
    this.showLoading(true);
    this.items$ = this.viaCepService.getAddressInformation(cep)
      .pipe(
        finalize(() => {
          this.showLoading(false);
        })
      )
      .subscribe({
        next: (res: any) => {
          this.items = [res];
          this.setResAPI(res);
        },
        error: (err: any) => {
          this.poNotification.error('Erro - onInitItems');
        },
      });
  }

  onInitForm(): void {
    this.formGroup = this.formBuilder.group({
      search: ['']
    });

    this.searchInput$ = this.formGroup.valueChanges
      .pipe(
        debounceTime(600),
        filter(
          value => value.search.length >= 8 || !value.search.length
        ),
        distinctUntilChanged(),
      )
      .subscribe({
        next: (res) => {
          this.onInitItems(res.search);
        }
      });
  }

}
