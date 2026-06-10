export interface User {
  id: number;

  role_id: number | null;

  name: string;
  email: string;

  is_active: boolean | number;

  role: {
    id: number;
    name: string;
  } | null;

  created_at?: string;
  updated_at?: string;
}
