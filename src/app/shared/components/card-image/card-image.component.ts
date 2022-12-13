import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from '@app/core/services/common.service';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-card-image',
  templateUrl: './card-image.component.html',
  styleUrls: ['./card-image.component.scss'],
})
export class CardImageComponent implements OnInit {
  @Input() image: any;
  constructor(private commonService: CommonService) {}

  ngOnInit() {}

  viewFullScreen() {}

  downloadImage() {
    const imageUrl = this.image.url;

    this.commonService
      .getBase64ImageFromURL(imageUrl)
      .subscribe((base64data) => {
        console.log(base64data);
        const base64Image = 'data:image/jpg;base64,' + base64data;
        var link = document.createElement('a');

        document.body.appendChild(link);

        link.setAttribute('href', base64Image);
        const filename = this.image.code + '.jpg';
        link.setAttribute('download', filename);
        link.click();
      });
  }

  handleError(event: any) {
    event.target.src = './assets/images/empty.png';
    event.onerror = null;
  }
}
