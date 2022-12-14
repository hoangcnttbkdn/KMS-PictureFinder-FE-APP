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

  public constructor(init?: Partial<Image>) {
    Object.assign(this, init);
  }
}
