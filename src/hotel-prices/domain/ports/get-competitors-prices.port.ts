import { CompetitorPrice } from "../model/competitor-price.model";

export interface GetCompetitorsPricesPort {
  execute(id: number, start: string, end: string): Promise<CompetitorPrice[]>;
  formatDate(str: string): Date;
  mapper(payload: any, id: number): CompetitorPrice[];
}
