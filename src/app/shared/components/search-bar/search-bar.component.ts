import { debounceTime, distinctUntilChanged, ReplaySubject } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  @Input() searchOnInput: boolean = false;
  @Output() searchButtonClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() searchKeywordChanged = new EventEmitter<string>();
  searchKeyword: string = '';

  private _searchKeywordChanged: ReplaySubject<string> = new ReplaySubject<string>();

  constructor() {
    this._searchKeywordChanged
      .pipe(
        debounceTime(300), // wait 300ms after the last event before emitting last event
        distinctUntilChanged() // only emit if value is different from previous value
      )
      .subscribe((searchKeyword: string) => {
        this.searchKeyword = searchKeyword.trim();
        this.searchKeywordChanged.emit(this.searchKeyword);
      });
  }

  ngOnInit() {}

  onSearchKeywordChanged(searchKeyword: string) {
    this._searchKeywordChanged.next(searchKeyword);
  }
}
