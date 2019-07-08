import { ObjectType, Field, ID } from 'type-graphql';
import { default as iterate } from 'itiriri';

// libraries
import { array } from '../lib/utils';

// models
import { Player } from './players';

import { ScopeAuthorization } from '../decorators/security';

@ObjectType({ description: 'Team model' })
export class Team {
  @ScopeAuthorization(['*'])
  @Field(_type => ID, { nullable: true })
  public id?: number;

  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public name?: string;

  @ScopeAuthorization(['*'])
  @Field(_type => [Player], { nullable: true })
  public players?: Player[];

  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public logo?: string;

  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public coverImage?: string;

  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public location?: string;

  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public facebook?: string;

  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public twitter?: string;

  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public rank?: number;
}

export class Teams {
  private teams: Team[];

  public constructor(teams: Partial<Team>[] | any) {
    this.teams = iterate(teams)
      .map((team: Partial<Team> | any) => {
        const mapped = {
          ...team,
        };
        return Object.assign(new Team(), mapped);
      })
      .toArray();
  }

  public find(criteria: any): Team[] {
    return array.filter(this.teams, criteria);
  }

  public get TEAMS(): Team[] {
    return this.find({});
  }
}
