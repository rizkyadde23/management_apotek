export interface Supplier {
  id: number;

  name: string;
  phone: string;
  email: string;
  address: string;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
