import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-image',
  templateUrl: './card-image.component.html',
  styleUrls: ['./card-image.component.scss'],
})
export class CardImageComponent implements OnInit {
  @Input() image: any;
  constructor() {}

  ngOnInit() {}

  viewFullScreen() {}

  downloadImage() {
    const url = this.image.url;
    fetch(url, {
      mode: 'no-cors',
    })
      .then((response) => response.blob())
      .then((blob) => {
        let blobUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.download = url.replace(/^.*[\\\/]/, '');
        a.href = blobUrl;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  }
}
