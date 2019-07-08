import LokiJS from 'lokijs';

export class InmemDB {
  private database: LokiJS;

  public constructor(name: string) {
    this.database = new LokiJS(name);
  }

  public get DATABASE() {
    return this.database;
  }
}
