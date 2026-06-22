"use client";

import { useEffect, useState } from "react";

import {
  getPurchaseOrders,
  approvePurchaseOrder,
  receivePurchaseOrder,
  cancelPurchaseOrder,
} from "@/lib/api/purchase-orders";

import PurchaseOrderDetailModal from "@/components/purchase-orders/PurchaseOrderDetailModal";

import { PurchaseOrder } from "@/types/purchase-order";

import PurchaseOrderFormModal from "@/components/purchase-orders/PurchaseOrderFormModal";

import { createPurchaseOrder } from "@/lib/api/purchase-orders";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import PrimaryButton from "@/components/ui/PrimaryButton";
import PurchaseOrderStats from "@/components/purchase-orders/PurchaseOrderStats";
import PurchaseOrderTable from "@/components/purchase-orders/PurchaseOrderTable";

import { Plus } from "lucide-react";

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);

  const [loading, setLoading] = useState(true);

  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  const [openDetail, setOpenDetail] = useState(false);

  const [openForm, setOpenForm] = useState(false);

  const [search, setSearch] = useState("");

  const filteredPurchaseOrders = purchaseOrders.filter(
    (po) =>
      po.po_number.toLowerCase().includes(search.toLowerCase()) ||
      po.supplier?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getPurchaseOrders();

      setPurchaseOrders(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(data: any) {
    try {
      await createPurchaseOrder(data);

      setOpenForm(false);

      await loadData();
    } catch (error) {
      console.error(error);

      alert("Gagal membuat PO");
    }
  }

  async function handleApprove(id: number) {
    await approvePurchaseOrder(id);

    loadData();
  }

  async function handleReceive(id: number) {
    await receivePurchaseOrder(id);

    loadData();
  }

  async function handleCancel(id: number) {
    if (!confirm("Yakin membatalkan PO?")) return;

    await cancelPurchaseOrder(id);

    loadData();
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Navbar />

          <div className="p-6">Loading Medicines...</div>
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
              title="Purchase Orders"
              description="Manage medicine purchase orders from suppliers."
              action={
                <PrimaryButton onClick={() => setOpenForm(true)}>
                  <Plus size={18} className="mr-2" />
                  Create PO
                </PrimaryButton>
              }
            />

            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search purchase order..."
            />

            <PurchaseOrderStats purchaseOrders={filteredPurchaseOrders} />

            <PurchaseOrderTable
              purchaseOrders={filteredPurchaseOrders}
              onDetail={(po) => {
                setSelectedPO(po);
                setOpenDetail(true);
              }}
              onApprove={handleApprove}
              onReceive={handleReceive}
              onCancel={handleCancel}
            />
          </div>
        </main>

        <PurchaseOrderDetailModal
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          purchaseOrder={selectedPO}
        />

        <PurchaseOrderFormModal
          open={openForm}
          onClose={() => setOpenForm(false)}
          onSubmit={handleCreate}
        />
      </div>
    </div>
  );
}
