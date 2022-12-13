import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from '@app/shared/services/notify.service';
import { finalize, map } from 'rxjs';
import { SessionInfo } from '../models/session';
import { FinderService } from '../services/finder.service';
//
import JSZip from 'jszip';
import * as FileSaver from 'file-saver';
//
@Component({
  selector: 'app-finder-result',
  templateUrl: './finder-result.component.html',
  styleUrls: ['./finder-result.component.scss'],
})
export class FinderResultComponent implements OnInit {
  imageFile: File;
  imagePreview: any;
  images: any[];
  allImages: any[];

  sessionInfo: SessionInfo;
  selectedType: string = 'me';
  url: string = '';
  cookie: string = '';
  token: string = '';
  isLoading: boolean = false;
  isLoadingSessionInfo: boolean = true;

  constructor(
    private finderService: FinderService,
    private notifyService: NotifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('sessionId');
    if (id) {
      this.isLoading = true;
      this.isLoadingSessionInfo = true;
      this.getSessionInfo(parseInt(id));
    }
  }

  onTypeChange() {
    if (this.selectedType === 'me') {
      this.images = Object.assign(
        [],
        this.allImages.filter((image) => image.isMatched)
      );
    } else {
      this.images = Object.assign([], this.allImages);
    }

    console.log(this.images);
  }

  getSessionInfo(sessionId: number) {
    if (sessionId) {
      let waiting = setInterval(() => {
        this.finderService.getInfoBySession(sessionId).subscribe((res: any) => {
          if (this.isLoadingSessionInfo && !!res) {
            this.sessionInfo = res;
            this.isLoadingSessionInfo = false;
          }

          if (res?.isFinished) {
            clearInterval(waiting);
            this.finderService
              .getImagesBySession(sessionId)
              .pipe(
                finalize(() => {
                  this.isLoading = false;
                })
              )
              .subscribe(
                (res: any) => {
                  this.images = res.filter((image) => image.isMatched);
                  this.allImages = res;
                },
                (err) => {
                  this.notifyService.showToast(err.error.message, 5000);
                }
              );
          }
        });
      }, 5000);
    }
  }

  findImages() {
    if (this.selectedType === 'drive') {
      this.finderService
        .findImagesFromDriveByOne(this.url, this.imageFile)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe(
          (res: any) => {
            this.images = res;
          },
          (err) => {
            this.notifyService.showToast(err.error.message, 5000);
          }
        );
    } else {
      this.finderService
        .findImagesFromFacebookByOne(
          this.url,
          this.imageFile,
          this.token,
          this.cookie
        )
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(
          (res: any) => {
            this.images = res;
          },
          (err) => {
            this.notifyService.showToast(err.error.message, 5000);
          }
        );
    }
  }

  downloadAllImages() {
    this.saveZip('PictureFindor.zip', this.images);
  }

  //
  saveZip = (filename, images) => {
    const zip = new JSZip();
    const folder = zip.folder('images'); // folder name where all files will be placed in

    images.forEach((image) => {
      const blobPromise = fetch(image.url).then((r) => {
        if (r.status === 200) return r.blob();
        return Promise.reject(new Error(r.statusText));
      })
      .catch((err) => {
        this.notifyService.showToast('Fail to download images', 5000);
      });
      let name = image.url
        .substring(image.url.lastIndexOf('/') + 1)
        .split('?')[0];

      // if name not contains jpg, png, jpeg then add .jpg
      if (!name.match(/\.(jpg|png|jpeg)$/)) {
        name += '.jpg';
      }
      //
      folder.file(name, blobPromise);
    });

    zip
      .generateAsync({ type: 'blob' })
      .then((blob) => FileSaver.saveAs(blob, filename));
  };
}
