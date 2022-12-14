import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isOnTop = true;

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    const verticalOffset =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    this.isOnTop = verticalOffset === 0 ? true : false;
  }
}
