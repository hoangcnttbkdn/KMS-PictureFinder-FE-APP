import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseService } from '@app/core/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class FinderService {
  constructor(private baseService: BaseService) {}

  findImagesFromFacebookByOne(
    albumUrl: string,
    targetImage: any,
    token: string,
    cookie: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('albumUrl', albumUrl);
    formData.append('targetImage', targetImage);
    formData.append('accessToken', token);
    formData.append('cookie', cookie);
    return this.baseService.postForm<any>(`facebook`, formData);
  }

  findImagesFromDriveByOne(
    folderUrl: string,
    targetImage: any
  ): Observable<any> {
    const formData = new FormData();
    console.log(folderUrl)
    formData.append('folderUrl', folderUrl);
    formData.append('targetImage', targetImage);
    return this.baseService.postForm<any>(`gg-drive`, formData);
  }
}
