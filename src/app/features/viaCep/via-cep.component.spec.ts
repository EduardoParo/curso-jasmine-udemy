import { TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { AppModule } from '../../app.module';
import { TableService } from '../../shared/services/table.service';
import { PokemonService } from '../../shared/services/pokemon.service';
import { PoNotificationService } from '@po-ui/ng-components';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ViaCepComponent } from './via-cep.component';
import { ViaCepService } from '../../shared/services/viacep.service';
import { UntypedFormBuilder } from '@angular/forms';

describe('ViaCepComponent', () => {
  let component: ViaCepComponent;
  let tableService: TableService;
  let viaCepService: ViaCepService;
  let poNotification: PoNotificationService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [AppModule],
      providers: [
        TableService,
        PokemonService,
        PoNotificationService,
        UntypedFormBuilder
      ],
      declarations: [ViaCepComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(ViaCepComponent);
    component = fixture.componentInstance;
    tableService = TestBed.inject(TableService);
    viaCepService = TestBed.inject(ViaCepService);
    poNotification = TestBed.inject(PoNotificationService);
    fixture.detectChanges();
  }));

  it('deve ser instanciado o component', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar o component - ngOnInit', () => {
    const spy1 = spyOn(component, 'onInitColumns');
    const spy2 = spyOn(component, 'onInitItems');
    const spy3 = spyOn(component, 'onInitForm');

    component.ngOnInit();

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();

  });

  it('deve retornar o nome da pagina -getAppName', () => {
    expect(component.getAppName()).toEqual('FORMAÇÃO JASMINE');
  });

  describe('showLoading', () => {
    it('deve mostrar o loading na tela', () => {
      component.showLoading(true);
      expect(component.resApi).toEqual('Carregando os dados da API');
      expect(component.isLoading).toBeTrue();
    });

    it('deve ocultar o loading na tela', () => {
      component.resApi = '';
      component.showLoading(false);
      expect(component.resApi).toEqual('');
      expect(component.isLoading).toBeFalse();
    });
  });

  it('deve retorna o array de menu -getMenus', () => {
    const spy0 = spyOn(component, 'onClick');
    const spy = component.getMenus();
    expect(spy[0].label).toEqual('Home');
    if (spy[0].action) {
      spy[0].action();
      expect(spy0).toHaveBeenCalled();
    }
  });

  it('deve iniciar as colunas -onInitColumns', fakeAsync(() => {
    spyOn(tableService, 'getColumnsViaCeep').and.resolveTo(['Nome']);
    component.onInitColumns();
    tick();
    expect(component.columns[0].property).toEqual('Nome');
  }));

  it('deve navegar para outra rota -onClick', () => {
    const spy = spyOn(component.router, 'navigate');
    component.onClick();
    expect(spy).toHaveBeenCalledWith(['pokemon']);
  });

  it('deve setar o rtorno da API -setResAPI', () => {
    component.setResAPI({});
    expect(component.resApi).toEqual('{}');
  });

  describe('onInitItems', () => {
    it('deve iniciar os items - Sucesso', fakeAsync(() => {
      const spy = spyOn(component, 'setResAPI');
      component.items = [];
      const res = { results: [{ name: 'EDU' }] };
      spyOn(viaCepService, 'getAddressInformation').and.returnValue(of(res));

      component.onInitItems();
      tick();

      expect(component.isLoading).toBeFalse();
      expect(component.items).toEqual([res]);
      expect(spy).toHaveBeenCalled();
    }));

    it('deve iniciar os items - Falha', fakeAsync(() => {
      const spy = spyOn(poNotification, 'error');
      component.items = [];
      spyOn(viaCepService, 'getAddressInformation').and.returnValue(throwError(() => (new Error())));

      component.onInitItems();
      tick();

      expect(component.isLoading).toBeFalse();
      expect(component.items).toEqual([]);
      expect(spy).toHaveBeenCalled();
    }));
  });

  describe('onInitForm', () => {
    it('deve iniciar o Formulario - Sucesso', fakeAsync(() => {

      const spy = spyOn(component, 'onInitItems');
      component.onInitForm();

      component.formGroup.get('search')?.setValue('123456789');
      tick(601);
      expect(component.formGroup.get('search')?.value).toEqual('123456789');

      expect(spy).toHaveBeenCalled();
      expect(component.formGroup).not.toBeNull();
    }));

    it('deve iniciar o Formulario -Search 2 - Sucesso', fakeAsync(() => {

      const spy = spyOn(component, 'onInitItems');
      component.onInitForm();

      component.formGroup.get('search')?.setValue('12');
      tick(601);
      expect(component.formGroup.get('search')?.value).toEqual('12');

      expect(spy).not.toHaveBeenCalled();
      expect(component.formGroup).not.toBeNull();
    }));


  });

});
