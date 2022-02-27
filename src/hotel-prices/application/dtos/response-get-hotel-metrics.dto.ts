export interface MetricSegmentDTO {
  gross_amount: number;
  net_amount: number;
  competitor_name: string;
}

export interface MetricsDTO {
  best_price: MetricSegmentDTO;
  average_price: MetricSegmentDTO;
  worst_price: MetricSegmentDTO;
}

export interface ResponseGetHotelMetricsDTO {
  room_id: string;
  room_name: string;
  metrics: MetricsDTO;
  last_updated_at: Date;
}
