import LokiJS from 'lokijs';
import * as _ from 'lodash';

import { inmemdb } from '../inmemdb';

export class Cache {
  public cache: LokiJS.Collection;

  public constructor(name: string, options = {}) {
    this.cache = inmemdb.DATABASE.addCollection(name, options);
  }

  public async find(criteria: { [key: string]: any } | undefined = undefined) {
    try {
      const findResponse = await this.cache.find(criteria);
      return findResponse;
    } catch (error) {
      return { error };
    }
  }

  public async findOne(criteria: { [key: string]: any }) {
    try {
      const findOneResponse = await this.cache.findOne(criteria);
      return findOneResponse;
    } catch (error) {
      return { error };
    }
  }

  public async updateOne(criteria: any, payload: any, options: { [key: string]: any } = {}) {
    try {
      const findOneResponse = await this.cache.findOne(criteria);
      if (!findOneResponse && options.upsert) await this.cache.insertOne(payload);
      else if (findOneResponse) this.cache.update(Object.assign({}, findOneResponse, payload));
      return true;
    } catch (error) {
      return { error };
    }
  }

  public async insert(payload: { [key: string]: any } | { [key: string]: any }[]) {
    try {
      await this.cache.insert(payload);
      return true;
    } catch (error) {
      return { error };
    }
  }
}
