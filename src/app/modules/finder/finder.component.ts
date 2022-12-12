import { Component, OnInit } from '@angular/core';
import { NotifyService } from '@app/shared/services/notify.service';
import { finalize, map } from 'rxjs';
import { SessionInfo } from '../models/session';
import { FinderService } from '../services/finder.service';

@Component({
  selector: 'app-finder',
  templateUrl: './finder.component.html',
  styleUrls: ['./finder.component.scss'],
})
export class FinderComponent implements OnInit {
  imageFile: File;
  imagePreview: any;
  images: [];

  sessionInfo: SessionInfo;
  selectedType: string = 'drive';
  url: string = '';
  cookie: string = '';
  token: string = '';
  isLoading: boolean = false;
  isInformPopupVisible: boolean = true;

  constructor(
    private finderService: FinderService,
    private notifyService: NotifyService
  ) {}

  ngOnInit() {}

  onImageUploaded(file: File) {
    this.imageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => (this.imagePreview = reader.result);
    reader.readAsDataURL(file);
  }

  selectedTypeChanged(type: string) {
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
    if (this.selectedType === 'drive') {
      this.finderService.getDriveSession(this.url, this.imageFile).subscribe(
        (res: any) => {
          const sessionId = res.sessionId;
          this.getSessionInfo(sessionId);
        },
        (err) => {
          this.notifyService.showToast(err.error.message, 5000);
        }
      );
    } else {
      this.finderService
        .getFacebokSession(this.url, this.imageFile, this.token, this.cookie)
        .subscribe((res: any) => {
          const sessionId = res.sessionId;
          this.getSessionInfo(sessionId);
        });
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

  validate() {
    // validate valid url
    if (!this.isValidUrl(this.url.trim())) {
      this.notifyService.showToast('Please enter a valid url', 3000);
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
}
