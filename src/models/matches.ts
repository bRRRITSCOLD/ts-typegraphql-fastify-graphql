import { ObjectType, Field, ID, UseMiddleware } from 'type-graphql';
import { default as iterate } from 'itiriri';

// models
import { Team } from './teams';
import { array } from '../lib/utils';
import { ScopeAuthorization } from '../decorators/security';

@ObjectType({ description: 'Match model' })
export class Match {
  @ScopeAuthorization(['*'])
  @Field(_type => ID, { nullable: true })
  public id?: number;

  @ScopeAuthorization(['*'])
  @Field(_type => [Team], { nullable: true })
  public teams?: Team[];

  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public format?: string;

  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public event?: string;

  // @Field(_type => [string])
  // public maps: string[];

  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public live?: boolean;

  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public stars?: number;
}

export class Matches {
  private matches: Match[];

  public constructor(matches: Partial<Match>[] | any) {
    this.matches = iterate(matches)
      .map((match: Partial<Match> | any) => {
        const mapped = {
          ...match,
          team1: undefined,
          team2: undefined,
          teams: [{ ...match.team1 }, { ...match.team2 }],
        };
        return Object.assign(new Match(), mapped);
      })
      .toArray();
  }

  public find(criteria: any): Match[] {
    return array.filter(this.matches, criteria);
  }

  public get MATCHES(): Match[] {
    return this.find({});
  }
}
