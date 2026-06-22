"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface PaymentDataItem {
  status: string;
  total: number;
}

interface Props {
  data: PaymentDataItem[];
}

const PAYMENT_COLORS: Record<string, string> = {
  CASH: "#22c55e",
  QRIS: "#3b82f6",
  TRANSFER: "#f59e0b",
  E_WALLET: "#8b5cf6",
};

const DEFAULT_COLOR = "#64748b";

export default function PaymentChart({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border shadow p-5">
      <h2 className="text-lg font-bold mb-5 text-slate-900">
        Metode Pembayaran
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={100}
            // 🌟 PERBAIKAN 1: Mengambil status & total dari properti payload
            label={({ payload }) => `${payload.status}: ${payload.total}`}
          >
            {data.map((entry) => (
              <Cell
                key={entry.status}
                fill={
                  PAYMENT_COLORS[entry.status.toUpperCase()] || DEFAULT_COLOR
                }
              />
            ))}
          </Pie>

          {/* 🌟 PERBAIKAN 2: Menghapus tipe manual yang kaku agar klop dengan Formatter Recharts */}
          <Tooltip
            formatter={(value, name) => [
              `${value} Transaksi`,
              String(name).toUpperCase(),
            ]}
          />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
