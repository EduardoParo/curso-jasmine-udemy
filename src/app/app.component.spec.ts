import { TestBed, waitForAsync } from '@angular/core/testing';

import {
  PoMenuModule,
  PoPageModule,
  PoToolbarModule,
} from '@po-ui/ng-components';

import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppModule } from './app.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        CommonModule,
        AppModule,
        PoMenuModule,
        PoPageModule,
        PoToolbarModule,
      ],
      declarations: [AppComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  }));

  it('deve instanciar o app', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar o componente', () => {
    const spy = spyOn(component, 'getMenus');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('deve retornar os items do menu -getMenus', () => {
    const spy = component.getMenus();
    expect(spy[0].label).toEqual('Home');
    expect(spy[1].label).toEqual('ViaCep');

  });

  describe('onClick', () => {
    it('deve navegar para outra rota viacep', () => {
      const spy = spyOn(router, 'navigate');
      component.onClick({ label: '' });
      expect(spy).toHaveBeenCalledWith(['']);
    });

    it('deve navegar para outra rota /', () => {
      const spy = spyOn(router, 'navigate');
      component.onClick({ label: 'ViaCep' });
      expect(spy).toHaveBeenCalledWith(['viacep']);
    });
  });

});
