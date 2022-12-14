import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, map } from 'rxjs';
import * as FileSaver from 'file-saver';
import JSZip from 'jszip';
//
import { NavigationType } from '@app/shared/enums/navigation-type.enum';

import { FinderService } from '../services/finder.service';
import { NotifyService } from '@app/shared/services/notify.service';
import { CommonService } from '@app/core/services/common.service';

import { SessionInfo } from '../models/session.model';
import { FacebookRequest } from './../models/facebook-request.model';
import { DriveRequest } from '../models/drive-request.model';
import { Image } from '../models/image.model';
import { FinderType } from '@app/shared/enums/finder-type.enum';
//
@Component({
  selector: 'app-finder-result',
  templateUrl: './finder-result.component.html',
  styleUrls: ['./finder-result.component.scss'],
})
export class FinderResultComponent implements OnInit {
  NavigationType = NavigationType;
  imageFile: File;
  imagePreview: any;
  images: Image[];
  allImages: Image[];

  sessionInfo: SessionInfo;
  selectedType: string = 'me';
  url: string = '';
  cookie: string = '';
  token: string = '';
  isLoading: boolean = false;
  isLoadingSessionInfo: boolean = true;
  isViewerOpen: boolean = false;
  selectedImage: any;
  selectedIndex: number;

  facebook: FacebookRequest = new FacebookRequest();
  drive: DriveRequest = new DriveRequest();

  constructor(
    private finderService: FinderService,
    private notifyService: NotifyService,
    private commonService: CommonService,
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

  //
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

  //#region Handle download images
  downloadImage(image: any) {
    this.commonService
      .getBase64ImageFromURL(image.url)
      .subscribe((base64data) => {
        this.commonService.downloadImage(base64data, image.code);
      });
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
  //#endregion
}
