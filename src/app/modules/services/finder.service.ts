import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseService } from '@app/core/services/base.service';
import { FacebookRequest } from '../models/facebook-request.model';
import { DriveRequest } from '../models/drive-request.model';
import { SessionInfo } from '../models/session.model';
import { Image } from '../models/image.model';
import { FinderByType, SocialType } from '@app/shared/enums/finder-type.enum';

@Injectable({
  providedIn: 'root',
})
export class FinderService {
  constructor(private baseService: BaseService) {}

  getSession(
    data: DriveRequest | FacebookRequest,
    socialType: SocialType,
    type: FinderByType
  ): Observable<any> {
    const url = socialType + '/' + type;
    if (type === FinderByType.BIB) {
      return this.baseService.post<any>(
        url,
        this.appendFormData(data, socialType, type)
      );
    } else {
      return this.baseService.postForm<any>(
        url,
        this.appendFormData(data, socialType, type)
      );
    }
  }

  getInfoBySession(sessionId: number): Observable<SessionInfo> {
    return this.baseService.get<SessionInfo>(`sessions/${sessionId}`);
  }

  getImagesBySession(sessionId: number): Observable<Image> {
    return this.baseService.get<Image>(`sessions/${sessionId}/images`);
  }

  // FormData
  appendFormData(data: any, socialType: SocialType, finderType: FinderByType) {
    if (finderType === FinderByType.BIB) {
      if (data.targetImage) delete data.targetImage;
      if (!data.email) delete data.email;
      return data;
    } else {
      const formData = new FormData();
      if (data.email) formData.append('email', data.email);

      switch (socialType) {
        case SocialType.Drive:
          formData.append('folderUrl', data.folderUrl);
          formData.append('targetImage', data.targetImage);
          return formData;
          break;
        case SocialType.Facebook:
          formData.append('albumUrl', data.albumUrl);
          formData.append('targetImage', data.targetImage);
          formData.append('accessToken', data.token);
          formData.append('cookie', data.cookie);
          return formData;
        default:
          break;
      }
    }
  }
}
