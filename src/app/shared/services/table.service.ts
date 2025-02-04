import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';
import { Observable, catchError, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  getColumnsPokemons(): PoTableColumn[] {
    const columns = [
      { property: 'name', label: 'Nome do Pokemon' },
    ];

    return columns;
  }

  getColumnsViaCeep(): Promise<string[]> {
    const columns = [
      "cep",
      "logradouro",
      "complemento",
      "unidade",
      "bairro",
      "localidade",
      "uf",
      "estado",
      "regiao",
      "ibge",
      "gia",
      "ddd",
      "siafi"
    ];

    return new Promise((resolve) => {
      resolve(columns);
    });
  }




}
