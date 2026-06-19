export interface AuditUser {
  id: number;
  name: string;
  email: string;
}

export interface AuditLog {
  id: number;

  user_id: number | null;

  action:
    | "CREATE"
    | "READ"
    | "UPDATE"
    | "DELETE"
    | "EXPORT"
    | "LOGIN"
    | "LOGOUT";

  module: string;

  description: string;

  old_value: any;

  new_value: any;

  ip_address: string;

  user_agent: string;

  created_at: string;

  updated_at: string;

  user?: AuditUser;
}

export interface AuditLogPagination {
  current_page: number;

  data: AuditLog[];

  last_page: number;

  total: number;

  per_page: number;
}