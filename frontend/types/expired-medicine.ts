export interface ExpiredMedicine {
  id: number;
  code: string;
  name: string;
  batch_number: string;
  stock: number;
  expired_date: string;
}

export interface ExpiredSummary {
  expired_count: number;
  expiring_soon_count: number;
}