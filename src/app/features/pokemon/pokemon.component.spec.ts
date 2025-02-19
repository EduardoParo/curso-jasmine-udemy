import { TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { PokemonComponent } from './pokemon.component';
import { AppModule } from '../../app.module';
import { TableService } from '../../shared/services/table.service';
import { PokemonService } from '../../shared/services/pokemon.service';
import { PoNotificationService } from '@po-ui/ng-components';
import { NO_ERRORS_SCHEMA, createPlatform } from '@angular/core';
import { of, throwError } from 'rxjs';

describe('PokemonComponent', () => {
  let component: PokemonComponent;
  let tableService: TableService;
  let pokemonService: PokemonService;
  let poNotification: PoNotificationService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [AppModule],
      providers: [
        TableService,
        PokemonService,
        PoNotificationService
      ],
      declarations: [PokemonComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokemonComponent);
    component = fixture.componentInstance;
    tableService = TestBed.inject(TableService);
    pokemonService = TestBed.inject(PokemonService);
    poNotification = TestBed.inject(PoNotificationService);
    fixture.detectChanges();
  }));

  it('deve ser instanciado o component', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar o component - ngOnInit', () => {
    const spy1 = spyOn(component, 'onInitBreadCrumb');
    const spy2 = spyOn(component, 'onInitItems');
    const spy3 = spyOn(component, 'onInitColumns');

    component.ngOnInit();

    expect(component.title).toEqual('Pokemon');
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();

  });

  it('deve retornar o nome da pagina -getAppName', () => {
    expect(component.getAppName()).toEqual('FORMAÇÃO JASMINE');
  });

  it('deve inicializar o BreadCrumb -onInitBreadCrumb', () => {

    component.onInitBreadCrumb();

    expect(component.breadcrumb.items[0].label).toEqual('Home');
    expect(component.breadcrumb.items[0].link).toEqual('/');
    expect(component.breadcrumb.items[1].label).toEqual('Pokemon');
  });

  it('deve iniciar as colunas da tabela', () => {
    spyOn(tableService, 'getColumnsPokemons').and.returnValue([]);
    const spy = spyOn(component, 'handleAction');

    component.onInitColumns();

    expect(component.columns).toEqual([]);;
    expect(component.tableActions[0].icon).toEqual('po-icon-eye');
    expect(component.tableActions[0].label).toEqual('Mostrar');

    // Verifica se a ação está definida antes de chamá-la
    if (component.tableActions[0]?.action) {
      component.tableActions[0].action();
      expect(spy).toHaveBeenCalled();
    }

    expect(spy).toHaveBeenCalled();
  });

  describe('handleAction', () => {

    it('deve realizar ação ao selecionar o pokemon -SUCESSO', fakeAsync(() => {
      const mockPokemon = {
        name: 'Pikachu',
        url: 'http://'
      };

      const spy = spyOn(component.poModal, 'open');
      spyOn(pokemonService, 'getPokemonInformation').and.resolveTo({ abilities: [] });

      component.handleAction(mockPokemon);

      tick();
      expect(component.titleModal).toEqual('Pikachu');
      expect(component.abilitiesPokemon).toEqual([]);
      expect(spy).toHaveBeenCalled();
    }));


    it('deve realizar ação ao selecionar o pokemon -ERROR', fakeAsync(() => {
      const mockPokemon = {
        name: 'Pikachu',
        url: 'http://'
      };

      const spy1 = spyOn(component.poModal, 'open');
      const spy2 = spyOn(poNotification, 'error');
      spyOn(pokemonService, 'getPokemonInformation').and.rejectWith({ error: [] });

      component.handleAction(mockPokemon);

      tick();
      expect(component.titleModal).toEqual('Pikachu');

      expect(spy1).not.toHaveBeenCalled();
      expect(spy2).toHaveBeenCalledWith('Erro - handleAction');
    }));

  });

  describe('onInitItems', () => {
    it('deve iniciar os items - Sucesso', fakeAsync(() => {
      spyOn(pokemonService, 'getAllPokemons').and.returnValue(of({ results: [{ name: 'EDU' }] }));
      component.items = [];
      component.onInitItems();

      tick();
      expect(component.isLoading).toBeFalse();
      expect(component.items).toEqual([{ name: 'EDU' }]);
    }));

    it('deve iniciar os items - Carregar Mais - Sucesso', fakeAsync(() => {
      component.items = [{ name: 'EDU' }];
      spyOn(pokemonService, 'getAllPokemons').and.returnValue(of({ results: [{ name: 'DUDU' }] }));

      component.onInitItems();

      tick();
      expect(component.isLoading).toBeFalse();
      expect(component.items).toEqual([{ name: 'EDU' }, { name: 'DUDU' }]);
    }));

    it('deve iniciar os items - Carregar Mais - Erro', fakeAsync(() => {
      component.items = [];
      spyOn(pokemonService, 'getAllPokemons').and.returnValue(throwError(() => new Error()));
      const spy = spyOn(poNotification, 'error');

      component.onInitItems();

      tick();
      expect(component.isLoading).toBeFalse();
      expect(component.items).toEqual([]);
      expect(spy).toHaveBeenCalledWith('Erro - onInitItems');
    }));
  });

  it('deve carregar mais items -loadMoreItems', () => {
    component.numPage = 5;
    const spy = spyOn(component, 'onInitItems');

    component.loadMoreItems();
    expect(component.numPage).toEqual(10);
    expect(spy).toHaveBeenCalled();
  });

  it('deve fechar o Modal -closeModal', () => {
    const spy = spyOn(component.poModal, 'close');
    component.closeModal();
    expect(spy).toHaveBeenCalled();
  });


});
