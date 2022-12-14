import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from '@app/core/services/common.service';
import { Image } from '@app/modules/models/image.model';
import { NavigationType } from '@app/shared/enums/navigation-type.enum';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
})
export class ImageGalleryComponent implements OnInit {
  @Input() images: Image[];

  NavigationType = NavigationType;
  isViewerOpen: boolean = false;
  selectedImage: Image;
  selectedIndex: number;

  constructor(private commonService: CommonService) {}

  ngOnInit() {}

  //#region Handle download images
  downloadImage(image: any) {
    this.commonService
      .getBase64ImageFromURL(image.url)
      .subscribe((base64data) => {
        this.commonService.downloadImage(base64data, image.code);
      });
  }

  onImageClicked(image, index) {
    this.selectedIndex = index;
    this.selectedImage = image;
    this.isViewerOpen = true;
  }

  changeSelectedImage(type: string) {
    switch (type) {
      case NavigationType.Previous:
        if (this.selectedIndex === 0) {
          this.selectedIndex = this.images.length - 1;
        } else {
          this.selectedIndex--;
        }

        break;
      case NavigationType.Next:
        if (this.selectedIndex === this.images.length - 1) {
          this.selectedIndex = 0;
        } else {
          this.selectedIndex++;
        }
        console.log(this.selectedIndex);

        break;
      default:
        break;
    }
    this.selectedImage = this.images[this.selectedIndex];
  }
}
