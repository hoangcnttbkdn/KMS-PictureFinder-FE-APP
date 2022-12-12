import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseService } from '@app/core/services/base.service';

@Injectable({
  providedIn: 'root',
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
    formData.append('folderUrl', folderUrl);
    formData.append('targetImage', targetImage);
    return this.baseService.postForm<any>(`gg-drive`, formData);
  }

  // updated
  getFacebokSession(
    albumUrl: string,
    targetImage: any,
    token: string,
    cookie: string,
    email: string,
  ): Observable<any> {
    const formData = new FormData();
    formData.append('albumUrl', albumUrl);
    formData.append('targetImage', targetImage);
    formData.append('accessToken', token);
    formData.append('cookie', cookie);
    formData.append('email', email);
    return this.baseService.postForm<any>(`facebook`, formData);
  }

  getDriveSession(folderUrl: string, targetImage: any, email: string,): Observable<any> {
    const formData = new FormData();
    formData.append('folderUrl', folderUrl);
    formData.append('targetImage', targetImage);
    formData.append('email', email);
    return this.baseService.postForm<any>(`gg-drive`, formData);
  }

  getInfoBySession(sessionId: number): Observable<any> {
    return this.baseService.get<any>(`sessions/${sessionId}`);
  }

  getImagesBySession(sessionId: number): Observable<any> {
    return this.baseService.get<any>(`sessions/${sessionId}/images`);
  }
}
