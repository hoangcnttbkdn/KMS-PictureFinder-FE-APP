import { Injectable } from '@angular/core';
import { NotifyService } from '@app/shared/services/notify.service';
import { Observable, Observer } from 'rxjs';
//
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(
    private baseService: BaseService,
    private notifyService: NotifyService
  ) {}

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      const img: HTMLImageElement = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
          this.notifyService.showToast('Fail to download this image', 5000);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const dataURL: string = canvas.toDataURL('image/png');

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }

  downloadImage(base64data, name) {
    const base64Image = 'data:image/jpg;base64,' + base64data;
    var link = document.createElement('a');

    document.body.appendChild(link);

    link.setAttribute('href', base64Image);
    const filename = name + '.jpg';
    link.setAttribute('download', filename);
    link.click();
  }
}
