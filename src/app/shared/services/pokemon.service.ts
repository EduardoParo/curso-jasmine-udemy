import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';
import { Observable, catchError, firstValueFrom, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  api = 'https://pokeapi.co/api/v2/pokemon/';

  constructor(
    private httpClient: HttpClient
  ) { }


  getColumns(): PoTableColumn[] {
    const columns = [
      { property: 'name', label: 'Nome do Pokemon' },
    ];

    return columns;
  }

  getAllPokemons(numPage = 0): Observable<any> {
    const url = `${this.api}?offset=${numPage}&limit=5`;
    return this.httpClient.get(url)
      .pipe(
        take(1),
        catchError(err => {
          return err;
        })
      );
  };

  getPokemonInformation(urlPokemon: string): Promise<any> {
    const res = this.httpClient.get(urlPokemon)
      .pipe(
        take(1),
        catchError(err => {
          return err;
        })
      );

    return firstValueFrom(res);
  };


}
