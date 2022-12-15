import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-finder-session',
  templateUrl: './finder-session.component.html',
  styleUrls: ['./finder-session.component.scss'],
})
export class FinderSessionComponent implements OnInit {
  sessionId: number;

  constructor(private router: Router) {}

  ngOnInit() {}

  onSearchButtonClicked() {
    if (this.sessionId) {
      this.router.navigateByUrl('/result/' + this.sessionId.toString());
    }
  }
}
