// node_modules
import { Service } from 'typedi';
import { HLTV as hltv } from 'hltv';

//models
import { Matches, Match } from '../../models/matches';

@Service()
export class MatchService {
  public constructor() {}

  public async fetchAll(): Promise<Matches> {
    try {
      const getMatchesResponse = await hltv.getMatches();
      const matches = new Matches(getMatchesResponse);
      return matches;
    } catch (error) {
      throw error;
    }
  }
}
