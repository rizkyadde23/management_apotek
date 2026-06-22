"use client";

import { useEffect, useState } from "react";

import {
  getPreOrders,
  readyPreOrder,
  completePreOrder,
  cancelPreOrder,
} from "@/lib/api/pre-orders";

import PreOrderDetailModal from "@/components/pre-orders/PreOrderDetailModal";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";

import PreOrderStats from "@/components/pre-orders/PreOrderStats";
import PreOrderTable from "@/components/pre-orders/PreOrderTable";

export default function PreOrdersPage() {
  const [preOrders, setPreOrders] = useState<any[]>([]);

  const [selected, setSelected] = useState<any>(null);

  const [openDetail, setOpenDetail] = useState(false);

  const [search, setSearch] = useState("");

  const filteredPreOrders = preOrders.filter(
    (item) =>
      item.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      item.medicine?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data = await getPreOrders();

    setPreOrders(data);
  }

  async function handleReady(id: number) {
    await readyPreOrder(id);

    loadData();
  }

  async function handleComplete(id: number) {
    await completePreOrder(id);

    loadData();
  }

  async function handleCancel(id: number) {
    await cancelPreOrder(id);

    loadData();
  }

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="space-y-6">
            <PageHeader
              title="Pre Orders"
              description="Manage customer medicine reservations."
            />

            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search pre order..."
            />

            <PreOrderStats preOrders={filteredPreOrders} />

            <PreOrderTable
              preOrders={filteredPreOrders}
              onDetail={(item) => {
                setSelected(item);
                setOpenDetail(true);
              }}
              onReady={handleReady}
              onComplete={handleComplete}
              onCancel={handleCancel}
            />
          </div>
        </main>

        <PreOrderDetailModal
          open={openDetail}
          preorder={selected}
          onClose={() => setOpenDetail(false)}
        />
      </div>
    </div>
  );
}
