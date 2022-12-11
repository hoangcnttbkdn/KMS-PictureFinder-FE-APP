import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from '@app/shared/services/notify.service';
import { finalize, map } from 'rxjs';
import { SessionInfo } from '../models/session';
import { FinderService } from '../services/finder.service';

@Component({
  selector: 'app-finder-result',
  templateUrl: './finder-result.component.html',
  styleUrls: ['./finder-result.component.scss'],
})
export class FinderResultComponent implements OnInit {
  imageFile: File;
  imagePreview: any;
  images: [];

  sessionInfo: SessionInfo;
  selectedType: string = 'drive';
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

  getSessionInfo(sessionId: number) {
    if (sessionId) {
      let waiting = setInterval(() => {
        this.finderService.getInfoBySession(sessionId).subscribe((res: any) => {
          if (this.isLoadingSessionInfo && !!res) {
            this.sessionInfo = res;
            this.isLoadingSessionInfo = false;
          }

          if (res.isFinished) {
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
