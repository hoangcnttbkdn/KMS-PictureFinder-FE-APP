import { FINDER_TYPES } from './../../shared/const/finder-type.const';
import { Component, OnInit } from '@angular/core';
import { NotifyService } from '@app/shared/services/notify.service';
import { finalize } from 'rxjs';
import { FinderService } from '../services/finder.service';
//
import JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { DriveRequest } from '../models/drive-request.model';
import { FacebookRequest } from '../models/facebook-request.model';
import { FinderByType, FinderType } from '@app/shared/enums/finder-type.enum';
import { SessionInfo } from '../models/session.model';
import { Image } from '../models/image.model';
import { NavigationType } from '@app/shared/enums/navigation-type.enum';
import { CommonService } from '@app/core/services/common.service';
//
@Component({
  selector: 'app-finder',
  templateUrl: './finder.component.html',
  styleUrls: ['./finder.component.scss'],
})
export class FinderComponent implements OnInit {
  FinderType = FinderType;
  NavigationType = NavigationType;
  FinderByType = FinderByType;
  FINDER_TYPES = FINDER_TYPES;

  imageFile: File;
  imagePreview: any;
  images: Image[];
  selectedType: FinderType = FinderType.Drive;
  selectedFinderType: {
    id: FinderByType;
    name: string;
    description: string;
  } = FINDER_TYPES[0];

  url: string = '';
  cookie: string = '';
  token: string = '';
  email: string = '';
  bib: string = '';

  facebook: FacebookRequest;
  drive: DriveRequest;
  sessionInfo: SessionInfo;

  isLoading: boolean = false;
  isInformPopupVisible: boolean = true;

  constructor(
    private finderService: FinderService,
    private notifyService: NotifyService
  ) {}

  ngOnInit() {}

  selectedTypeChanged(type: FinderType) {
    this.selectedType = type;
  }

  onSearchButtonClicked() {
    if (!this.validate()) {
      return;
    }
    this.isLoading = true;
    this.images = [];
    this.getSession();
  }

  getSession() {
    switch (this.selectedType) {
      case FinderType.Drive:
        this.drive = new DriveRequest({
          folderUrl: this.url,
          targetImage: this.imageFile,
          email: this.email,
        });
        this.finderService.getDriveSession(this.drive).subscribe(
          (res: any) => {
            const sessionId = res.sessionId;
            this.getSessionInfo(sessionId);
          },
          (err) => {
            this.isLoading = false;
            this.notifyService.showToast(err.error.message, 5000);
          }
        );
        break;
      case FinderType.Facebook:
        this.facebook = new FacebookRequest({
          albumUrl: this.url,
          cookie: this.cookie,
          token: this.token,
          targetImage: this.imageFile,
          email: this.email,
        });
        this.finderService
          .getFacebokSession(this.facebook)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
          .subscribe(
            (res: any) => {
              const sessionId = res.sessionId;
              this.getSessionInfo(sessionId);
            },
            (err) => {
              this.notifyService.showToast(err.error.message, 5000);
            }
          );
        break;

      default:
        break;
    }
  }

  getSessionInfo(sessionId: number) {
    if (sessionId) {
      let waiting = setInterval(() => {
        this.finderService.getInfoBySession(sessionId).subscribe((res: any) => {
          if (!this.sessionInfo) {
            this.sessionInfo = res;
            this.isInformPopupVisible = true;
          }
          if (res?.isFinished) {
            clearInterval(waiting);
            this.finderService.getImagesBySession(sessionId).subscribe(
              (res: any) => {
                this.images = res.filter((image) => image.isMatched);
                this.isLoading = false;
              },
              (err) => {
                this.isLoading = false;
                this.notifyService.showToast(err.error.message, 5000);
              }
            );
          }
        });
      }, 5000);
    }
  }

  onImageUploaded(file: File) {
    this.imageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => (this.imagePreview = reader.result);
    reader.readAsDataURL(file);
  }

  findImages() {
    switch (this.selectedType) {
      case FinderType.Drive:
        this.drive = new DriveRequest({
          folderUrl: this.url,
          targetImage: this.imageFile,
        });
        this.finderService
          .findImagesFromDriveByOne(this.drive)
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
        break;
      case FinderType.Facebook:
        this.facebook = new FacebookRequest({
          albumUrl: this.url,
          cookie: this.cookie,
          token: this.token,
          targetImage: this.imageFile,
        });
        this.finderService
          .findImagesFromFacebookByOne(this.facebook)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(
            (res: any) => {
              this.images = res;
            },
            (err) => {
              this.notifyService.showToast(err.error.message, 5000);
            }
          );
        break;
    }
  }

  saveZip = (filename, images) => {
    const zip = new JSZip();
    const folder = zip.folder('images'); // folder name where all files will be placed in

    images.forEach((image) => {
      const blobPromise = fetch(image.url)
        .then((r) => {
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

  validate() {
    // validate email
    if (this.email !== '') {
      if (!this.isValidEmail(this.email.trim())) {
        this.notifyService.showToast('Email is invalid', 3000);
        return false;
      }
    }
    // validate valid url
    if (!this.isValidUrl(this.url.trim())) {
      this.notifyService.showToast('Url is invalid', 3000);
      return false;
    }
    // validate has targetImage
    if (!this.imageFile) {
      this.notifyService.showToast('Please select a target image', 3000);
      return false;
    }
    // if type is facebook, validate has access token, cookie
    if (
      this.selectedType === 'facebook' &&
      (this.token.trim() === '' || this.cookie.trim() === '')
    ) {
      this.notifyService.showToast(
        'Please enter a valid token and cookie',
        3000
      );
      return false;
    }
    return true;
  }

  isValidUrl(url: string) {
    const urlRegex =
      /^((http|https|ftp|www):\/\/)?([a-zA-Z0-9\~\!\@\#\$\%\^\&\*\(\)_\-\=\+\\\/\?\.\:\;\'\,]*)(\.)([a-zA-Z0-9\~\!\@\#\$\%\^\&\*\(\)_\-\=\+\\\/\?\.\:\;\'\,]+)/g;
    const result = url.match(urlRegex);
    return result !== null;
  }

  isValidEmail(email) {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  }
}
