import { TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';
import { PokemonService } from './pokemon.service';
import { Injector } from '@angular/core';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        Injector,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  }));

  it('deve ser instanciado', () => {
    expect(service).toBeTruthy();
  });

  it('deve capturar as colunas -getColumns', () => {
    const spy = service.getColumns();
    expect(spy[0].label).toEqual('Nome do Pokemon');
  });

  describe('getAllPokemons', () => {
    it('deve capturar todos os pokemons', fakeAsync(() => {
      service.getAllPokemons()
        .subscribe({
          next: (res) => {
            expect(res).toEqual({ name: 'pokemon1' });
          }
        });

      const req = httpMock.expectOne(`${service.api}?offset=0&limit=5`);
      expect(req.request.method).toEqual('GET');
      req.flush({ name: 'pokemon1' });
      httpMock.verify();
    }));

    it('deve capturar erro ao falhar na requisição', () => {

      service.getAllPokemons(0)
        .subscribe({
          next: () => ({}),
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(500);
            expect(error.statusText).toBe('Internal Server Error');
          }
        });

      const req = httpMock.expectOne(`${service.api}?offset=0&limit=5`);
      req.flush('Erro na API', { status: 500, statusText: 'Internal Server Error' });
      httpMock.verify();
    });

    describe('getPokemonInformation', () => {
      it('deve retornar as informação do pokemon - FALHA', fakeAsync(() => {
        service.getPokemonInformation('')
          .then(res => {
            expect(res).toEqual({ name: 'pokemon1' });
          });

        const req = httpMock.expectOne(``);
        req.flush('Erro na API', { status: 500, statusText: 'Internal Server Error' });
        httpMock.verify();
      }));

    });





  });

});
