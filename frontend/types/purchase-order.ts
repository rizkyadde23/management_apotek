export interface PurchaseOrderDetail {
  id: number;
  medicine_id: number;
  quantity: number;
  unit_price: string;
  subtotal: string;

  medicine: {
    id: number;
    name: string;
  };
}

export interface PurchaseOrder {
  id: number;

  po_number: string;

  supplier_id: number;

  created_by: number;

  status:
    | "PENDING"
    | "APPROVED"
    | "RECEIVED"
    | "CANCELLED";

  created_at: string;

  supplier: {
    id: number;
    name: string;
  };

  creator: {
    id: number;
    name: string;
  };

  details: PurchaseOrderDetail[];
}