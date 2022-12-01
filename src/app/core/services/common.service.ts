import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private baseService: BaseService) {}

  //#endregion
}
