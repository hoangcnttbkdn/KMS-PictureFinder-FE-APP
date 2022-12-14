import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseService } from '@app/core/services/base.service';
import { FacebookRequest } from '../models/facebook-request.model';
import { DriveRequest } from '../models/drive-request.model';
import { SessionInfo, SessionRequest } from '../models/session.model';
import { Image } from '../models/image.model';

@Injectable({
  providedIn: 'root',
})
export class FinderService {
  constructor(private baseService: BaseService) {}

  findImagesFromFacebookByOne(data: FacebookRequest): Observable<any> {
    const formData = new FormData();
    formData.append('albumUrl', data.albumUrl);
    formData.append('targetImage', data.targetImage);
    formData.append('accessToken', data.token);
    formData.append('cookie', data.cookie);
    return this.baseService.postForm<any>(`facebook`, formData);
  }

  findImagesFromDriveByOne(data: DriveRequest): Observable<any> {
    const formData = new FormData();
    formData.append('folderUrl', data.folderUrl);
    formData.append('targetImage', data.targetImage);
    return this.baseService.postForm<any>(`gg-drive`, formData);
  }

  getFacebokSession(data: FacebookRequest): Observable<any> {
    const formData = new FormData();
    formData.append('albumUrl', data.albumUrl);
    formData.append('targetImage', data.targetImage);
    formData.append('accessToken', data.token);
    formData.append('cookie', data.cookie);
    formData.append('email', data.email);
    return this.baseService.postForm<any>(`facebook`, formData);
  }

  getDriveSession(data: DriveRequest
  ): Observable<any> {
    const formData = new FormData();
    formData.append('folderUrl', data.folderUrl);
    formData.append('targetImage', data.targetImage);
    formData.append('email', data.email);
    return this.baseService.postForm<any>(`gg-drive`, formData);
  }

  getInfoBySession(sessionId: number): Observable<SessionInfo> {
    return this.baseService.get<SessionInfo>(`sessions/${sessionId}`);
  }

  getImagesBySession(sessionId: number): Observable<Image> {
    return this.baseService.get<Image>(`sessions/${sessionId}/images`);
  }
}
