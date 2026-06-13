export interface LowStockMedicine {
  id: number;
  supplier_id: number;
  category_id: number;

  code: string;
  batch_number: string;

  name: string;
  description: string;

  type: string;

  stock: number;
  minimum_stock: number;

  price: string;

  expired_date: string;

  is_active: boolean;

  created_at: string;
  updated_at: string;

  supplier?: {
    id: number;
    name: string;
  };

  category?: {
    id: number;
    name: string;
  };
}