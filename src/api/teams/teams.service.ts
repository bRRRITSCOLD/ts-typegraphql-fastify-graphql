// node_modules
import { Service } from 'typedi';
import { HLTV as hltv } from 'hltv';
import * as _ from 'lodash';

// libraries
import { Cache } from '../../lib/cache';

//models
import { Teams, Team } from '../../models/teams';

const teamsCache = new Cache('teams', {
  ttl: 60000 * 30,
  ttlInterval: 60000 * 31,
});

@Service()
export class TeamService {
  public constructor() {}

  public async fetchSome(ids: number[]): Promise<Teams> {
    try {
      const cached = await teamsCache.find({ id: { $in: ids } });
      // @ts-ignore
      const uncached = !cached.length || cached.error ? ids : _.difference(cached.map((team: any) => team.id), ids);
      const chunked = _.chunk(uncached, 1);
      let getTeamResponses: any = [];
      const tasks = [];
      for (let i = 0; i < chunked.length; i++) {
        for (let j = 0; j < chunked[i].length; j++) tasks.push(hltv.getTeam({ id: chunked[i][j] }));
        const complete = await Promise.all(tasks);
        getTeamResponses = _.concat(getTeamResponses, complete);
      }
      // @ts-ignore
      const teams = new Teams(_.uniqBy([...getTeamResponses, ...(!cached.error || cached.length ? cached : [])], 'id'));
      await teamsCache.insert(teams.TEAMS);
      return teams;
    } catch (error) {
      throw error;
    }
  }
}
