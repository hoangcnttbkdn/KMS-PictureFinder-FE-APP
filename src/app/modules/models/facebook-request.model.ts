export class FacebookRequest {
  albumUrl: string;
  targetImage: File;
  token: string;
  cookie: string;
  email?: string;
  bib?: string;

  public constructor(init?: Partial<FacebookRequest>) {
    Object.assign(this, init);
  }
}
