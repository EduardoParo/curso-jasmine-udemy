import { OnInit, Directive, Injector, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PoBreadcrumb,
  PoDynamicFormField,
  PoModalComponent,
  PoNotificationService,
  PoPageAction,
  PoTableColumn,
} from '@po-ui/ng-components';
import { Subscription } from 'rxjs';

@Directive()
export abstract class BaseResourceComponent implements OnInit, OnDestroy {
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;
  columns!: PoTableColumn[];
  items!: any[];
  breadcrumb!: PoBreadcrumb;
  isLoading = false;
  poNotification: PoNotificationService;
  router!: Router;
  items$!: Subscription;
  titleToolbar!: string;

  constructor(
    protected injector: Injector,
    protected title: string,
  ) {
    this.router = injector.get(Router);
    this.poNotification = injector.get(PoNotificationService);
  }

  ngOnInit(): void {
    this.onInitPage();
  }

  ngOnDestroy(): void {
    this.items$.unsubscribe();
  }

  onInitPage(): void {
    this.titleToolbar = this.title;
    this.onInitBreadCrumb();
  }


  onInitBreadCrumb(): void {
    this.breadcrumb = {
      items: [{ label: 'Home', link: '/' }, { label: this.title }],
    };
  }


}
