export class DriveRequest {
  folderUrl: string;
  targetImage: File;
  email?: string;

  public constructor(init?: Partial<DriveRequest>) {
    Object.assign(this, init);
  }
}
