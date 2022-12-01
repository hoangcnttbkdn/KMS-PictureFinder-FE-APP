import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.scss']
})
export class SelectBoxComponent implements OnInit {
  selectedType: string = 'drive';
  @Output() selectedTypeChanged = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }

  onTypeChange(type: string) {
    this.selectedType = type;
    this.selectedTypeChanged.emit(type);
  }
}
