import { Component, Input, OnInit } from '@angular/core';
import { Country } from '../../interfaces/country.interface';
import { CountryService } from '../../services/country.service';
import { Region } from '../../interfaces/region.type';

@Component({
  selector: 'countries-by-region-page',
  templateUrl: './by-region-page.component.html',
})
export class ByRegionPageComponent implements OnInit{
  public selectedRegion?: Region;

  public regions: Region[] = ['Asia' , 'Americas' , 'Africa' ,'Oceania' , 'Europe'];

  @Input()
  public countries: Country[] = [];

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.countries    = this.countryService.cacheStore.byRegion.countries;
    this.selectedRegion = this.countryService.cacheStore.byRegion.region;
  }

  searchByRegion(term: Region): void {
    this.selectedRegion = term;

    this.countryService.searchRegion(term)
      .subscribe(countries => {
        this.countries = countries;
      });
  }
}
