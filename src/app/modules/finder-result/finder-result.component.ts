import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
//
import { NavigationType } from '@app/shared/enums/navigation-type.enum';

import { FinderService } from '../services/finder.service';
import { NotifyService } from '@app/shared/services/notify.service';

import { SessionInfo } from '../models/session.model';
import { Image } from '../models/image.model';
//
@Component({
  selector: 'app-finder-result',
  templateUrl: './finder-result.component.html',
  styleUrls: ['./finder-result.component.scss'],
})
export class FinderResultComponent implements OnInit {
  NavigationType = NavigationType;
  imageFile: File;
  images: Image[];
  allImages: Image[];

  sessionInfo: SessionInfo;
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
          if (!res) {
            this.notifyService.showToast('This session is not exist', 5000);
            this.isLoadingSessionInfo = false;
            this.isLoading = false;
            clearInterval(waiting);
            return;
          }

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
}
