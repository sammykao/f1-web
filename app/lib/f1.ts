import { z } from 'zod';

// F1 API Configuration
const BASE_URL = "/api/f1";

// Type definitions using Zod schemas
const MRDataSchema = z.object({
  series: z.literal('f1'),
  url: z.string(),
  limit: z.string().transform(val => parseInt(val, 10)),
  offset: z.string().transform(val => parseInt(val, 10)),
  total: z.string().transform(val => parseInt(val, 10))
});

const LocationSchema = z.object({
  lat: z.string(),
  long: z.string(),
  locality: z.string(),
  country: z.string()
});

const CircuitSchema = z.object({
  circuitId: z.string(),
  url: z.string(),
  circuitName: z.string(),
  Location: LocationSchema
});

const ConstructorSchema = z.object({
  constructorId: z.string(),
  url: z.string(),
  name: z.string(),
  nationality: z.string()
});

const DriverSchema = z.object({
  driverId: z.string(),
  permanentNumber: z.string().optional(),
  code: z.string().optional(),
  url: z.string(),
  givenName: z.string(),
  familyName: z.string(),
  dateOfBirth: z.string(),
  nationality: z.string()
});

const RaceResultSchema = z.object({
  number: z.string(),
  position: z.string(),
  positionText: z.string(),
  points: z.string(),
  Driver: DriverSchema,
  Constructor: ConstructorSchema,
  grid: z.string(),
  laps: z.string(),
  status: z.string(),
  Time: z.object({
    millis: z.string().optional(),
    time: z.string()
  }).optional(),
  FastestLap: z.object({
    rank: z.string(),
    lap: z.string(),
    Time: z.object({
      time: z.string()
    }).optional(),
    AverageSpeed: z.object({
      units: z.string(),
      speed: z.string()
    }).optional()
  }).optional()
});

const RaceSchema = z.object({
  season: z.string(),
  round: z.string(),
  url: z.string(),
  raceName: z.string(),
  Circuit: CircuitSchema,
  date: z.string(),
  time: z.string().optional(),
  Results: z.array(RaceResultSchema).optional()
});

const DriverStandingSchema = z.object({
  position: z.string(),
  positionText: z.string(),
  points: z.string(),
  wins: z.string(),
  Driver: DriverSchema,
  Constructors: z.array(ConstructorSchema)
});

const ConstructorStandingSchema = z.object({
  position: z.string(),
  positionText: z.string(),
  points: z.string(),
  wins: z.string(),
  Constructor: ConstructorSchema
});

const LapTimeSchema = z.object({
  number: z.string(),
  Timings: z.array(z.object({
    driverId: z.string(),
    position: z.string(),
    time: z.string()
  }))
});

const QualifyingResultSchema = z.object({
  number: z.string(),
  position: z.string(),
  Driver: DriverSchema,
  Constructor: ConstructorSchema,
  Q1: z.string().optional(),
  Q2: z.string().optional(),
  Q3: z.string().optional()
});

// Response schemas
const RaceResponseSchema = z.object({
  MRData: MRDataSchema.extend({
    RaceTable: z.object({
      season: z.string().optional(),
      round: z.string().optional(),
      Races: z.array(RaceSchema)
    })
  })
});

const DriverStandingsResponseSchema = z.object({
  MRData: MRDataSchema.extend({
    StandingsTable: z.object({
      season: z.string(),
      StandingsLists: z.array(z.object({
        season: z.string(),
        round: z.string(),
        DriverStandings: z.array(DriverStandingSchema)
      }))
    })
  })
});

const ConstructorStandingsResponseSchema = z.object({
  MRData: MRDataSchema.extend({
    StandingsTable: z.object({
      season: z.string(),
      StandingsLists: z.array(z.object({
        season: z.string(),
        round: z.string(),
        ConstructorStandings: z.array(ConstructorStandingSchema)
      }))
    })
  })
});

const LapTimesResponseSchema = z.object({
  MRData: MRDataSchema.extend({
    RaceTable: z.object({
      season: z.string(),
      round: z.string(),
      Races: z.array(z.object({
        season: z.string(),
        round: z.string(),
        url: z.string(),
        raceName: z.string(),
        Circuit: CircuitSchema,
        date: z.string(),
        time: z.string().optional(),
        Laps: z.array(LapTimeSchema)
      }))
    })
  })
});

const QualifyingResponseSchema = z.object({
  MRData: MRDataSchema.extend({
    RaceTable: z.object({
      season: z.string(),
      round: z.string(),
      Races: z.array(z.object({
        season: z.string(),
        round: z.string(),
        raceName: z.string(),
        Circuit: CircuitSchema,
        date: z.string(),
        time: z.string().optional(),
        QualifyingResults: z.array(QualifyingResultSchema)
      }))
    })
  })
});

const ScheduleResponseSchema = z.object({
  MRData: MRDataSchema.extend({
    RaceTable: z.object({
      season: z.string(),
      Races: z.array(z.object({
        season: z.string(),
        round: z.string(),
        raceName: z.string(),
        Circuit: CircuitSchema,
        date: z.string(),
        time: z.string().optional(),
        FirstPractice: z.object({
          date: z.string(),
          time: z.string().optional()
        }).optional(),
        SecondPractice: z.object({
          date: z.string(),
          time: z.string().optional()
        }).optional(),
        ThirdPractice: z.object({
          date: z.string(),
          time: z.string().optional()
        }).optional(),
        Qualifying: z.object({
          date: z.string(),
          time: z.string().optional()
        }).optional(),
        Sprint: z.object({
          date: z.string(),
          time: z.string().optional()
        }).optional()
      }))
    })
  })
});

// Interfaces for type safety
export interface F1Driver {
  id: string;
  number?: string;
  code?: string;
  firstName: string;
  lastName: string;
  nationality: string;
  team: F1Constructor;
  position: number;
  points: number;
  wins: number;
}

export interface F1Constructor {
  id: string;
  name: string;
  nationality: string;
  position: number;
  points: number;
  wins: number;
  color: string;
}

export interface F1RaceResult {
  position: number;
  driver: F1Driver;
  grid: number;
  laps: number;
  status: string;
  points: number;
  time?: {
    millis: number;
    display: string;
  };
  fastestLap?: {
    lap: number;
    time?: string;
    averageSpeed?: {
      speed: number;
      units: string;
    };
  };
}

export interface F1LapTime {
  lap: number;
  timings: Array<{
    driverId: string;
    position: number;
    time: string;
  }>;
}

export interface F1QualifyingResult {
  position: number;
  driver: F1Driver;
  q1Time?: string;
  q2Time?: string;
  q3Time?: string;
}

export interface F1Race {
  round: number;
  raceName: string;
  circuit: {
    name: string;
    location: string;
    country: string;
  };
  date: string;
  time?: string;
  sessions: {
    fp1?: { date: string; time?: string };
    fp2?: { date: string; time?: string };
    fp3?: { date: string; time?: string };
    qualifying?: { date: string; time?: string };
    sprint?: { date: string; time?: string };
  };
}

// Team colors mapping - 2024 colors
const TEAM_COLORS: Record<string, string> = {
  'red_bull': '#3671C6',
  'ferrari': '#F91536',
  'mercedes': '#6CD3BF',
  'mclaren': '#F58020',
  'aston_martin': '#358C75',
  'alpine': '#2293D1',
  'williams': '#37BEDD',
  'rb': '#5E8FAA',
  'stake': '#C92D4B',
  'haas': '#B6BABD'
};

export class F1Client {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = BASE_URL;
  }

  private async fetchData(endpoint: string, params: Record<string, string> = {}): Promise<any> {
    // Add the endpoint to the path parameter
    params.path = endpoint;
    
    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}?${queryString}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  private getTeamColor(constructorId: string): string {
    return TEAM_COLORS[constructorId.toLowerCase()] || '#666666';
  }

  async getCurrentSeason(): Promise<string> {
    const data = await this.fetchData('/current/last/results.json');
    const response = RaceResponseSchema.parse(data);
    return response.MRData.RaceTable.Races[0].season;
  }

  async getDriverStandings(season?: string): Promise<F1Driver[]> {
    const endpoint = season ? `/${season}/driverStandings.json` : '/current/driverStandings.json';
    const data = await this.fetchData(endpoint);
    const response = DriverStandingsResponseSchema.parse(data);
    
    const standings = response.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
    return standings.map(standing => ({
      id: standing.Driver.driverId,
      number: standing.Driver.permanentNumber,
      code: standing.Driver.code,
      firstName: standing.Driver.givenName,
      lastName: standing.Driver.familyName,
      nationality: standing.Driver.nationality,
      team: {
        id: standing.Constructors[0].constructorId,
        name: standing.Constructors[0].name,
        nationality: standing.Constructors[0].nationality,
        position: 0, // Will be filled by constructor standings
        points: 0,
        wins: 0,
        color: this.getTeamColor(standing.Constructors[0].constructorId)
      },
      position: parseInt(standing.position),
      points: parseFloat(standing.points),
      wins: parseInt(standing.wins)
    }));
  }

  async getConstructorStandings(season?: string): Promise<F1Constructor[]> {
    const endpoint = season ? `/${season}/constructorStandings.json` : '/current/constructorStandings.json';
    const data = await this.fetchData(endpoint);
    const response = ConstructorStandingsResponseSchema.parse(data);
    
    const standings = response.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
    return standings.map(standing => ({
      id: standing.Constructor.constructorId,
      name: standing.Constructor.name,
      nationality: standing.Constructor.nationality,
      position: parseInt(standing.position),
      points: parseFloat(standing.points),
      wins: parseInt(standing.wins),
      color: this.getTeamColor(standing.Constructor.constructorId)
    }));
  }

  async getLastRaceResults(): Promise<F1RaceResult[]> {
    const data = await this.fetchData('/current/last/results.json');
    const response = RaceResponseSchema.parse(data);
    
    const results = response.MRData.RaceTable.Races[0]?.Results || [];
    return results.map(result => ({
      position: parseInt(result.position),
      driver: {
        id: result.Driver.driverId,
        number: result.Driver.permanentNumber,
        code: result.Driver.code,
        firstName: result.Driver.givenName,
        lastName: result.Driver.familyName,
        nationality: result.Driver.nationality,
        team: {
          id: result.Constructor.constructorId,
          name: result.Constructor.name,
          nationality: result.Constructor.nationality,
          position: 0,
          points: 0,
          wins: 0,
          color: this.getTeamColor(result.Constructor.constructorId)
        },
        position: 0,
        points: 0,
        wins: 0
      },
      grid: parseInt(result.grid),
      laps: parseInt(result.laps),
      status: result.status,
      points: parseFloat(result.points),
      time: result.Time ? {
        millis: parseInt(result.Time.millis || '0'),
        display: result.Time.time
      } : undefined,
      fastestLap: result.FastestLap ? {
        lap: parseInt(result.FastestLap.lap),
        time: result.FastestLap.Time?.time,
        averageSpeed: result.FastestLap.AverageSpeed ? {
          speed: parseFloat(result.FastestLap.AverageSpeed.speed),
          units: result.FastestLap.AverageSpeed.units
        } : undefined
      } : undefined
    }));
  }

  async getRaceLapTimes(season: string, round: string): Promise<F1LapTime[]> {
    const data = await this.fetchData(`/${season}/${round}/laps.json`);
    const response = LapTimesResponseSchema.parse(data);
    
    const laps = response.MRData.RaceTable.Races[0]?.Laps || [];
    return laps.map(lap => ({
      lap: parseInt(lap.number),
      timings: lap.Timings.map(timing => ({
        driverId: timing.driverId,
        position: parseInt(timing.position),
        time: timing.time
      }))
    }));
  }

  async getLastQualifying(): Promise<F1QualifyingResult[]> {
    const data = await this.fetchData('/current/last/qualifying.json');
    const response = QualifyingResponseSchema.parse(data);
    
    const results = response.MRData.RaceTable.Races[0]?.QualifyingResults || [];
    return results.map(result => ({
      position: parseInt(result.position),
      driver: {
        id: result.Driver.driverId,
        number: result.Driver.permanentNumber,
        code: result.Driver.code,
        firstName: result.Driver.givenName,
        lastName: result.Driver.familyName,
        nationality: result.Driver.nationality,
        team: {
          id: result.Constructor.constructorId,
          name: result.Constructor.name,
          nationality: result.Constructor.nationality,
          position: 0,
          points: 0,
          wins: 0,
          color: this.getTeamColor(result.Constructor.constructorId)
        },
        position: 0,
        points: 0,
        wins: 0
      },
      q1Time: result.Q1,
      q2Time: result.Q2,
      q3Time: result.Q3
    }));
  }

  async getSeasonSchedule(): Promise<F1Race[]> {
    const data = await this.fetchData('/current.json');
    const response = ScheduleResponseSchema.parse(data);
    
    return response.MRData.RaceTable.Races.map(race => ({
      round: parseInt(race.round),
      raceName: race.raceName,
      circuit: {
        name: race.Circuit.circuitName,
        location: race.Circuit.Location.locality,
        country: race.Circuit.Location.country
      },
      date: race.date,
      time: race.time,
      sessions: {
        fp1: race.FirstPractice,
        fp2: race.SecondPractice,
        fp3: race.ThirdPractice,
        qualifying: race.Qualifying,
        sprint: race.Sprint
      }
    }));
  }

  async getDriverResults(driverId: string, limit: number = 100): Promise<F1RaceResult[]> {
    // Fetch both race and sprint results
    const [raceData, sprintData] = await Promise.all([
      this.fetchData(`/current/drivers/${driverId}/results.json`, { limit: limit.toString() }),
      this.fetchData(`/current/drivers/${driverId}/sprint.json`, { limit: limit.toString() })
    ]);
    
    const raceResponse = RaceResponseSchema.parse(raceData);
    const sprintResponse = RaceResponseSchema.parse(sprintData);
    
    const results: F1RaceResult[] = [];
    
    // Combine and sort all races by round number
    const allRaces = [
      ...raceResponse.MRData.RaceTable.Races.map(race => ({ ...race, isSprint: false })),
      ...sprintResponse.MRData.RaceTable.Races.map(race => ({ ...race, isSprint: true }))
    ].sort((a, b) => parseInt(a.round) - parseInt(b.round));

    for (const race of allRaces) {
      const result = race.Results?.[0];
      if (result) {
        results.push({
          position: parseInt(result.position),
          driver: {
            id: result.Driver.driverId,
            number: result.Driver.permanentNumber,
            code: result.Driver.code,
            firstName: result.Driver.givenName,
            lastName: result.Driver.familyName,
            nationality: result.Driver.nationality,
            team: {
              id: result.Constructor.constructorId,
              name: result.Constructor.name,
              nationality: result.Constructor.nationality,
              position: 0,
              points: 0,
              wins: 0,
              color: this.getTeamColor(result.Constructor.constructorId)
            },
            position: 0,
            points: parseFloat(result.points),
            wins: 0
          },
          grid: parseInt(result.grid),
          laps: parseInt(result.laps),
          status: race.isSprint ? `Sprint: ${result.status}` : result.status,
          time: result.Time ? {
            millis: parseInt(result.Time.millis || '0'),
            display: result.Time.time
          } : undefined,
          fastestLap: result.FastestLap ? {
            lap: parseInt(result.FastestLap.lap),
            time: result.FastestLap.Time?.time,
            averageSpeed: result.FastestLap.AverageSpeed ? {
              speed: parseFloat(result.FastestLap.AverageSpeed.speed),
              units: result.FastestLap.AverageSpeed.units
            } : undefined
          } : undefined,
          points: parseFloat(result.points)
        });
      }
    }
    return results;
  }
}

export const f1Client = new F1Client(); 