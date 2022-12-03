import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CommonService } from '@app/core/services/common.service';
import { NotifyService } from '@app/shared/services/notify.service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent implements OnInit {
  @Input() onlyButton: boolean = false;
  @Input() isLoading: boolean = false;
  @Output() onImageUploaded: EventEmitter<string> = new EventEmitter();
  constructor(private notifyService: NotifyService) {}

  ngOnInit(): void {}

  onUploadFile(e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // validate file type only png jpg jpeg
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        this.notifyService.showToast('Only png and jpg files are allowed', 5000);
        return;
      }
      // validate file size smaller than 5mb
      if (file.size > 5 * 1024 * 1024) {
        this.notifyService.showToast(
          'File size must be smaller than 5mb',
          5000
        );
        return;
      };
      this.onImageUploaded.emit(file);
    }
  }
}
