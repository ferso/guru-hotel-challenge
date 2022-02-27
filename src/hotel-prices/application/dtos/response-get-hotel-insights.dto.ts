export interface PricesHotelInsightsDTO {
  id: string;
  competitor_name: string;
  room_id: string;
  currency: string;
  taxes: number;
  amount: number;
  date: Date;
}
export interface ResponseGetHotelInsightsDTO {
  room_id: string;
  room_name: string;
  prices: PricesHotelInsightsDTO[];
  last_updated_at: Date;
}
