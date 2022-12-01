import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CommonService } from '@app/core/services/common.service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {
  @Input() onlyButton: boolean = false;
  @Output() onImageUploaded: EventEmitter<string> = new EventEmitter();
  constructor(private commonService: CommonService) {}

  ngOnInit(): void {}

  onFileSelected(e) {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles[0]) {
      for (let i = 0; i < selectedFiles.length; i++) {
        this.commonService.uploadImage(selectedFiles[i]).subscribe(res => {
          this.onImageUploaded.emit(res);
        });
      }
    }
  }

  onUploadFile(e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      this.onImageUploaded.emit(file);
    }
  }
}
