import { CountryService } from './../../services/country.service';
import { Component, Input, OnInit } from '@angular/core';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'countries-by-country-page',
  templateUrl: './by-country-page.component.html'
})
export class ByCountryPageComponent implements OnInit{
  @Input()
  public countries: Country[] = [];

  public initialValue: string = '';

  constructor(private countryService: CountryService) {

  }

  ngOnInit(): void {
    this.countries = this.countryService.cacheStore.byCountry.countries;
    this.initialValue = this.countryService.cacheStore.byCountry.term;
  }

  searchByCountry(term:string):void {
    this.countryService.searchCountry(term)
      .subscribe(countries => {
        this.countries = countries
      });
  }
}
