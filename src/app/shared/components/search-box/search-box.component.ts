import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { Region } from '../../../countries/interfaces/region.type';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
})
export class SearchBoxComponent implements OnInit, OnDestroy{

  public debouncer: Subject<string> = new Subject<string>();
  private debuncerSubscription?: Subscription;

  @Input()
  public initialValue: string = '';

  @Input()
  public placeholder: String = '';

  @Output()
  public onValue: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  public onDebounce: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(): void {
    this.debuncerSubscription = this.debouncer
    .pipe(
      debounceTime(500)
    )
    .subscribe(value => {
      this.emitDebounce(value);
    });
  }

  ngOnDestroy(): void {
    this.debuncerSubscription?.unsubscribe();
  }

  emitValue(term:string): void {
    this.onValue.emit(term);
  }

  emitDebounce(term:string): void {
    this.onDebounce.emit(term);
  }

  onKeyPress(term: string) {
    this.debouncer.next(term);
  }

}
