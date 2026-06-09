export interface User {
  id: number;
  name: string;
  email: string;
  is_active: number;

  role: {
    id: number;
    name: string;
  } | null;
}