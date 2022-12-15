import { Component, Input, OnInit } from '@angular/core';
import { Image } from '@app/modules/models/image.model';
import { NotifyService } from '@app/shared/services/notify.service';
import JSZip from 'jszip';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-download-image-button',
  templateUrl: './download-image-button.component.html',
  styleUrls: ['./download-image-button.component.scss']
})
export class DownloadImageButtonComponent implements OnInit {
  @Input() images: Image[];
  constructor(private notifyService: NotifyService) { }

  ngOnInit() {
  }

  downloadAllImages() {
    this.saveZip('PictureFindor.zip', this.images);
  }

  saveZip = (filename, images) => {
    const zip = new JSZip();
    const folder = zip.folder('images'); // folder name

    images.forEach((image) => {
      const blobPromise = fetch(image.url)
        .then((r) => {
          if (r.status === 200) return r.blob();
          return Promise.reject(new Error(r.statusText));
        })
        .catch(() => {
          this.notifyService.showToast('Fail to download images', 5000);
        });
      let name = image.url
        .substring(image.url.lastIndexOf('/') + 1)
        .split('?')[0];

      // handle if name not contains jpg, png, jpeg then add .jpg
      if (!name.match(/\.(jpg|png|jpeg)$/)) {
        name += '.jpg';
      }
      folder.file(name, blobPromise);
    });

    zip
      .generateAsync({ type: 'blob' })
      .then((blob) => FileSaver.saveAs(blob, filename));
  };
  
}
