"use client";

import { useEffect, useState } from "react";

import { getTransactions } from "@/lib/api/transactions";

import { Transaction } from "@/types/transaction";

import TransactionDetailModal from "@/components/transactions/TransactionDetailModal";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import TransactionStats from "@/components/transactions/TransactionStats";
import TransactionTable from "@/components/transactions/TransactionTable";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [loading, setLoading] = useState(true);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [openDetail, setOpenDetail] = useState(false);

  const [search, setSearch] = useState("");

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.transaction_code
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      transaction.user?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getTransactions();

      setTransactions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Navbar />

          <div className="p-6">Loading suppliers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="space-y-6">
            <PageHeader
              title="Transactions"
              description="Manage pharmacy sales transactions."
            />

            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search transaction..."
            />

            <TransactionStats transactions={filteredTransactions} />

            <TransactionTable
              transactions={filteredTransactions}
              onDetail={(transaction) => {
                setSelectedTransaction(transaction);

                setOpenDetail(true);
              }}
            />
          </div>
        </main>

        <TransactionDetailModal
          open={openDetail}
          transaction={selectedTransaction}
          onClose={() => setOpenDetail(false)}
        />
      </div>
    </div>
  );
}
