export interface DashboardData {
  cards: {
    total_medicines: number;
    total_suppliers: number;
    low_stock: number;
    expired_medicines: number;
    today_transactions: number;
    today_revenue: number;
    month_revenue: number;
  };

  sales_chart: {
    month: string;
    total: number;
  }[];

  top_medicines: {
    name: string;
    total: number;
  }[];

  stock_chart: {
    supplier: string;
    stock: number;
  }[];

  payment_chart: {
    status: string;
    total: number;
  }[];

  low_stock_table: {
  id: number;
  name: string;
  stock: number;
  minimum_stock: number;
}[];

expired_table: {
  id: number;
  name: string;
  expired_date: string;
}[];

recent_transactions: {
  id: number;
  transaction_code: string;
  total: number;
  payment_status: string;
  created_at: string;
  user: {
    name: string;
  };
}[];

recent_notifications: {
  id: number;
  title: string;
  message: string;
  created_at: string;
}[];
}