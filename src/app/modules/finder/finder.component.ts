import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { FinderService } from '../services/finder.service';

@Component({
  selector: 'app-finder',
  templateUrl: './finder.component.html'
})
export class FinderComponent implements OnInit {
  imageFile: File;
  imagePreview: any;
  images = [];

  selectedType: string = 'drive';
  url: string = '';
  cookie: string = '';
  token: string = '';
  isLoading: boolean = false;

  constructor(private finderService: FinderService) {}

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
    if (this.url.trim() === '' || !this.validateUrl(this.url.trim())) {
      alert('Please enter a valid url');
      return false;
    }
    // validate has targetImage
    if (!this.imageFile) {
      alert('Please select a target image');
      return false;
    }
    // if type is facebook, validate has access token, cookie
    if (
      this.selectedType === 'facebook' &&
      (this.token.trim() === '' || this.cookie.trim() === '')
    ) {
      alert('Please enter a valid token and cookie');
      return false;
    }
    return true;
  }

  validateUrl(url: string) {
    var urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    );
    return !!urlPattern.test(url);
  }
}
