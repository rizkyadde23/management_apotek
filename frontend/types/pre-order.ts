export interface PreOrder {
  id: number;
  medicine_id: number;
  purchase_order_id?: number | null;
  user_id?: number | null;

  customer_name: string;
  customer_phone: string;

  quantity: number;

  status: "PENDING" | "READY" | "COMPLETED" | "CANCELLED";

  estimated_arrival_date?: string | null;

  notes?: string | null;

  medicine?: {
    id: number;
    name: string;
  };

  purchase_order?: {
    id: number;
    po_number: string;
  };
}
