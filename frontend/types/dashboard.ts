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
}