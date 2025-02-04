import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {
  url = 'http://viacep.com.br/ws/';
  adressInfoBKP!: any;

  constructor(
    private httpClient: HttpClient
  ) { }

  getAddressInformation(cep: string): Observable<any> {
    const url = this.getUrl(cep);
    return this.httpClient.get(url)
      .pipe(
        take(1),
        tap(res => {
          this.adressInfoBKP = res;
        })
      );
  }

  getUrl(cep: string): string {
    return `${this.url}${cep}/json/`;
  }

}
