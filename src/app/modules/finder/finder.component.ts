import { Component, OnInit } from '@angular/core';
import { NotifyService } from '@app/shared/services/notify.service';
import { finalize } from 'rxjs';
import { FinderService } from '../services/finder.service';

@Component({
  selector: 'app-finder',
  templateUrl: './finder.component.html',
  styleUrls: ['./finder.component.scss']
})
export class FinderComponent implements OnInit {
  imageFile: File;
  imagePreview: any;
  images = [
    {
      url: 'https://static1.dienanh.net/360x720/upload/2020/04/06/baifern-pimchanok-chung-to-nhan-sac-tu-nhien-voi-anh-tho-au-xinh-dep-ccc47b.jpg',
      id: 1,
    },
    {
      url: 'https://static1.dienanh.net/360x720/upload/2020/04/06/baifern-pimchanok-chung-to-nhan-sac-tu-nhien-voi-anh-tho-au-xinh-dep-ccc47b.jpg',
      id: 2,
    },
    {
      url: 'https://static1.dienanh.net/360x720/upload/2020/04/06/baifern-pimchanok-chung-to-nhan-sac-tu-nhien-voi-anh-tho-au-xinh-dep-ccc47b.jpg',
      id: 3,
    },
    {
      url: 'https://static1.dienanh.net/360x720/upload/2020/04/06/baifern-pimchanok-chung-to-nhan-sac-tu-nhien-voi-anh-tho-au-xinh-dep-ccc47b.jpg',
      id: 1,
    },
    {
      url: 'https://static1.dienanh.net/360x720/upload/2020/04/06/baifern-pimchanok-chung-to-nhan-sac-tu-nhien-voi-anh-tho-au-xinh-dep-ccc47b.jpg',
      id: 2,
    },
    {
      url: 'https://static1.dienanh.net/360x720/upload/2020/04/06/baifern-pimchanok-chung-to-nhan-sac-tu-nhien-voi-anh-tho-au-xinh-dep-ccc47b.jpg',
      id: 3,
    },
  ];

  selectedType: string = 'drive';
  url: string = '';
  cookie: string = '';
  token: string = '';
  isLoading: boolean = false;

  constructor(private finderService: FinderService, private notifyService: NotifyService) {}

  ngOnInit() {}

  onImageUploaded(file: File) {
    this.imageFile = file;
    const reader = new FileReader();
    reader.onload = e => (this.imagePreview = reader.result);

    reader.readAsDataURL(file);
  }

  selectedTypeChanged(type: string) {
    this.selectedType = type;
  }

  findImages() {
    if (!this.validate()) return;
    this.isLoading = true;
    this.images = [];
    if (this.selectedType === 'drive') {
      this.finderService
        .findImagesFromDriveByOne(this.url, this.imageFile)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next(res: any) {
            this.images = res;
            console.log(res);
            this.isLoading = false;
          }
        });
    } else {
      this.finderService
        .findImagesFromFacebookByOne(
          this.url,
          this.imageFile,
          this.token,
          this.cookie
        )
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next(res: any) {
            this.images = res;
            console.log(res);
            this.isLoading = false;
          }
        });
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
      this.notifyService.showToast('Please enter a valid token and cookie', 3000);
      return false;
    }
    return true;
  }

  isValidUrl(url: string) {
    const urlRegex = /^((http|https|ftp|www):\/\/)?([a-zA-Z0-9\~\!\@\#\$\%\^\&\*\(\)_\-\=\+\\\/\?\.\:\;\'\,]*)(\.)([a-zA-Z0-9\~\!\@\#\$\%\^\&\*\(\)_\-\=\+\\\/\?\.\:\;\'\,]+)/g;
    const result = url.match(urlRegex);
    return result !== null;
  };
  
}
