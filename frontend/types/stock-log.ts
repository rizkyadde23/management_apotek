export interface StockLog {
  id: number;

  type: "IN" | "OUT";

  quantity: number;

  stock_before: number;

  stock_after: number;

  notes: string | null;

  created_at: string;

  medicine: {
    id: number;

    code: string;

    name: string;
  };

  user: {
    id: number;

    name: string;
  };
}
