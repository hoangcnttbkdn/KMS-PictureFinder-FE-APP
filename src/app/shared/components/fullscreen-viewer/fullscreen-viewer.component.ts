import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-fullscreen-viewer',
  templateUrl: './fullscreen-viewer.component.html',
  styleUrls: ['./fullscreen-viewer.component.scss'],
})
export class FullscreenViewerComponent {
  @Input() open: boolean;
  @Input() image: any;

  @Output() close = new EventEmitter();
  @Output() onDownload = new EventEmitter();
  @Output() onPrev = new EventEmitter();
  @Output() onNext = new EventEmitter();


  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
    this.close.emit();
  }
}
