import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonService } from '@app/core/services/common.service';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-card-image',
  templateUrl: './card-image.component.html',
  styleUrls: ['./card-image.component.scss'],
})
export class CardImageComponent implements OnInit {
  @Input() image: any;
  @Output() onImageClicked = new EventEmitter();

  constructor(private commonService: CommonService) {}

  ngOnInit() {}

  viewFullScreen() {}

  handleImageClicked(image) {
    this.onImageClicked.emit(image);
  }

  downloadImage(event) {
    event.preventDefault();
    event.stopPropagation();

    const imageUrl = this.image.url;

    this.commonService
      .getBase64ImageFromURL(imageUrl)
      .subscribe((base64data) => {
        this.commonService.downloadImage(base64data, this.image.code);
      });
  }

  handleError(event: any) {
    event.target.src = './assets/images/empty.png';
    event.onerror = null;
  }
}
