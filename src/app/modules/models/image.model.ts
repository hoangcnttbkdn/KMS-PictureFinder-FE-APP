export class Image {
  id: number;
  code: string;
  url: string;
  isMatched: boolean;
  recognizedAt: Date;
  extraData: string;
  errorLogs?: any;
  createdAt: Date;
  updatedAt: Date;
  extraDatas: ExtraData;

  public constructor(init?: Partial<Image>) {
    Object.assign(this, init);
  }
}


export class ExtraData {
  numberOfFace: number;
  faceLocation: number[];
  confident: number;

  public constructor(init?: Partial<ExtraData>) {
    Object.assign(this, init);
  }
}