export interface Medicine {
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

  category: {
    id: number;
    name: string;
  };

  supplier: {
    id: number;
    name: string;
  };
}
