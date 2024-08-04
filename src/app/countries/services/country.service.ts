import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Country } from '../interfaces/country.interface';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';
import { CacheStore } from '../interfaces/chacheStore.interface';
import { Region } from '../interfaces/region.type';

@Injectable({providedIn: 'root'})
export class CountryService {

  private apiUrl:string = "https://restcountries.com/v3.1"

  public cacheStore: CacheStore = {
    byCapital: {term:''         , countries:[]},
    byCountry: {term:''         , countries:[]},
    byRegion : {region:undefined, countries:[]}
  }

  constructor(private httpClient: HttpClient) {
    this.loadFromLocalStorage();
  }

  searchByAlphaCode(alphaCode: string): Observable<Country | null> {
    const url = `${this.apiUrl}/alpha/${alphaCode}`;

    return this.httpClient.get<Country[]>(url)
      .pipe(
        map((countries) => countries.length > 0 ? countries[0] : null),
        catchError(error => of(null))
      );
  }

  searchCapital(searchTerm: string): Observable<Country[]> {
    const url = `${this.apiUrl}/capital/${searchTerm}`;

    return this.getCountriesRequest(url)
      .pipe(
        tap(countries => this.cacheStore.byCapital = {
          term: searchTerm,
          countries: countries
        }),
        tap(() => this.saveToLocalStorage())
      );
  }

  searchRegion(searchTerm: Region): Observable<Country[]> {
    const url = `${this.apiUrl}/region/${searchTerm}`;

    return this.getCountriesRequest(url)
      .pipe(
        tap(countries => this.cacheStore.byRegion = {region:searchTerm, countries:countries}),
        tap(() => this.saveToLocalStorage())
      );
  }

  searchCountry(searchTerm: string): Observable<Country[]> {
    const url = `${this.apiUrl}/name/${searchTerm}`;

    return this.getCountriesRequest(url)
      .pipe(
        tap(countries => this.cacheStore.byCountry = {term:searchTerm, countries:countries}),
        tap(() => this.saveToLocalStorage())
      );
  }

  private getCountriesRequest(url: string): Observable<Country[]> {
    return this.httpClient.get<Country[]>(url)
                          .pipe(
                            catchError(error => of([])),
                            //delay(2000)
                          );
  }

  private saveToLocalStorage():void {
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage(): void {
    if (!localStorage.getItem('cacheStore')) return;

    this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!);
  }
}
