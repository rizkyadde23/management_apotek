export interface TransactionMedicine {
  id: number;
  name: string;
  price: string;
}

export interface TransactionDetail {
  id: number;
  medicine_id: number;
  quantity: number;
  price: string;
  subtotal: string;

  medicine: TransactionMedicine;
}

export interface TransactionUser {
  id: number;
  name: string;
  email: string;
}

export interface Transaction {
  id: number;

  transaction_code: string;

  subtotal: string;

  discount: string;

  total: string;

  payment_status: string;

  created_at: string;

  user: TransactionUser;

  details: TransactionDetail[];
}