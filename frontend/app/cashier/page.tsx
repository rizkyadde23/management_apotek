"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Loader2,
  CreditCard,
} from "lucide-react";

import { api } from "@/lib/api";

// Import komponen internal bawaan projekmu
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SearchBar from "@/components/ui/SearchBar";

// Interface untuk data Obat dari Backend Laravel
interface Medicine {
  id: number;
  name: string;
  price: number;
  stock: number;
  category?:
    | {
        name: string;
      }
    | string;
  expired_date?: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  category: string;
}

type PaymentMethod = "CASH" | "QRIS" | "TRANSFER" | "E_WALLET";

export default function KasirPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [search, setSearch] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");

  // State untuk UX Loading & Error
  const [isLoadingMedicines, setIsLoadingMedicines] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // ==========================================
  // 1. FETCH DATA OBAT DARI API LARAVEL
  // ==========================================
  const fetchMedicines = async () => {
    setIsLoadingMedicines(true);
    try {
      // 🌟 PERBAIKAN KUNCI: Samakan key localStorage menjadi "auth_token"
      const token = localStorage.getItem("auth_token");

      const response = await api.get("/medicines", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMedicines(response.data.data.data);
    } catch (error) {
      console.error("Gagal mengambil data obat:", error);
      alert(
        "Gagal memuat daftar obat. Pastikan backend menyala atau token valid.",
      );
    } finally {
      setIsLoadingMedicines(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Filter obat berdasarkan input SearchBar
  const filteredMedicines = useMemo(() => {
    if (!Array.isArray(medicines)) return [];
    return medicines.filter((medicine) => {
      const nameMatch = medicine.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const categoryName =
        typeof medicine.category === "object"
          ? medicine.category.name
          : medicine.category;
      const categoryMatch = categoryName
        ?.toLowerCase()
        .includes(search.toLowerCase());
      return nameMatch || categoryMatch;
    });
  }, [search, medicines]);

  // ==========================================
  // 2. LOGIKA PERHITUNGAN KASIR
  // ==========================================
  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const changeAmount = useMemo(() => {
    if (paymentMethod !== "CASH") return 0;
    const paid = parseFloat(paymentAmount) || 0;
    const change = paid - totalAmount;
    return change < 0 ? 0 : change;
  }, [paymentAmount, totalAmount, paymentMethod]);

  // Otomatis isi jika non-cash
  useEffect(() => {
    if (paymentMethod !== "CASH" && totalAmount > 0) {
      setPaymentAmount(totalAmount.toString());
    } else if (paymentMethod === "CASH") {
      setPaymentAmount("");
    }
  }, [paymentMethod, totalAmount]);

  // Logika Keranjang Belanja
  const handleAddToCart = (medicine: Medicine) => {
    if (medicine.stock <= 0) return;

    const categoryText =
      typeof medicine.category === "object"
        ? medicine.category.name
        : medicine.category || "Umum";

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === medicine.id);
      if (existingItem) {
        if (existingItem.quantity >= medicine.stock) {
          alert(
            `Stok tidak mencukupi! Batas maksimal adalah ${medicine.stock}.`,
          );
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prevCart,
        {
          id: medicine.id,
          name: medicine.name,
          price: medicine.price,
          quantity: 1,
          stock: medicine.stock,
          category: categoryText,
        },
      ];
    });
  };

  const handleDecreaseQuantity = (id: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // ========================================================
  // 3. PROSES SUBMIT TRANSAKSI DAN PEMBAYARAN (BERTAHAP)
  // ========================================================
  const handleSubmitTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || isSubmitting) return;

    const paidAmount = parseFloat(paymentAmount) || 0;
    if (paidAmount < totalAmount) {
      alert("Uang pembayaran kurang dari total tagihan!");
      return;
    }

    setIsSubmitting(true);

    const savedToken = localStorage.getItem("auth_token");

    if (!savedToken) {
      alert("Sesi Anda habis atau token hilang. Silakan login kembali.");
      setIsSubmitting(false);
      return;
    }

    try {
      // -------------------------------------------------------
      // TAHAP A: Buat Transaksi Terlebih Dahulu (Status: Unpaid)
      // -------------------------------------------------------
      const transactionPayload = {
        items: cart.map((item) => ({
          medicine_id: item.id,
          quantity: item.quantity,
        })),
      };

      const transResponse = await api.post(
        "/transactions",
        transactionPayload,
        {
          headers: { Authorization: `Bearer ${savedToken}` },
        },
      );

      const transactionId =
        transResponse.data?.data?.id || transResponse.data?.id;

      if (!transactionId) {
        throw new Error("Gagal mendapatkan ID Transaksi.");
      }

      // -------------------------------------------------------
      // TAHAP B: Bayar Transaksi via PaymentController
      // -------------------------------------------------------
      const paymentPayload = {
        amount: paidAmount,
        amount_paid: paidAmount,
        payment_method: paymentMethod,
      };

      await api.post(`/transactions/${transactionId}/pay`, paymentPayload, {
        headers: { Authorization: `Bearer ${savedToken}` },
      });

      alert("Transaksi & Pembayaran Sukses Dikonfirmasi!");

      // -------------------------------------------------------
      // TAHAP C: Cetak Struk Menggunakan Axios (Response Type 'Blob')
      // -------------------------------------------------------
      try {
        const response = await api.get(
          `/transactions/${transactionId}/invoice`,
          {
            responseType: "blob",
            headers: { Authorization: `Bearer ${savedToken}` }, // Proteksi header aman terkendali
          },
        );

        const fileBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(fileBlob);

        const cetakWindow = window.open(pdfUrl, "_blank");

        if (cetakWindow) {
          cetakWindow.onload = () => {
            cetakWindow.print();
            URL.revokeObjectURL(pdfUrl);
          };
        }
      } catch (error: any) {
        console.error("Gagal mencetak struk:", error);
        alert("Transaksi sukses, tetapi gagal memuat lembar PDF cetak struk.");
      }

      // -------------------------------------------------------
      // TAHAP D: Reset State Form
      // -------------------------------------------------------
      setCart([]);
      setPaymentAmount("");
      setPaymentMethod("CASH");

      // Sinkronisasi ulang data obat ke layar kasir
      fetchMedicines();
    } catch (error: any) {
      console.error("LOG ERROR KASIR:", error);
      alert("Terjadi kesalahan saat memproses transaksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex flex-1 flex-col p-5 overflow-hidden">
          <div className="mb-3 flex-shrink-0">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Kasir Apotek
            </h1>
            <p className="text-xs text-slate-500">
              Eksekusi transaksi obat aman terkendali oleh Apoteker.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-4 flex-1 min-h-0 w-full overflow-hidden">
            {/* 1. KATALOG OBAT */}
            <div className="col-span-8 flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm overflow-hidden h-full">
              <div className="flex-shrink-0 mb-3">
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  placeholder="Cari obat berdasarkan nama produk atau kategori..."
                />
              </div>

              <div className="flex-1 overflow-y-auto pr-1 min-h-0">
                {isLoadingMedicines ? (
                  <div className="flex h-full flex-col items-center justify-center text-slate-400 gap-2 py-10">
                    <Loader2 className="animate-spin text-blue-600" size={24} />
                    <p className="text-xs">Menghubungkan ke server apotek...</p>
                  </div>
                ) : filteredMedicines.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-slate-400 py-10">
                    <p className="text-xs">
                      Obat tidak tersedia atau kata kunci salah.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredMedicines.map((medicine) => {
                      const isOutOfStock = medicine.stock === 0;
                      const isLowStock =
                        medicine.stock > 0 && medicine.stock <= 10;

                      // Deteksi Expired hari ini (23 Juni 2026)
                      const isExpired = medicine.expired_date
                        ? new Date(medicine.expired_date) <= new Date()
                        : false;

                      const categoryName =
                        typeof medicine.category === "object"
                          ? medicine.category.name
                          : medicine.category || "Umum";

                      return (
                        <div
                          key={medicine.id}
                          onClick={() =>
                            !isOutOfStock &&
                            !isExpired &&
                            handleAddToCart(medicine)
                          }
                          className={`group flex flex-col justify-between rounded-lg border p-3 transition-all duration-150 ${
                            isExpired
                              ? "border-red-200 bg-red-50/30 opacity-75 cursor-not-allowed"
                              : isOutOfStock
                                ? "border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed"
                                : "cursor-pointer border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm active:scale-[0.99]"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                                {categoryName}
                              </span>

                              {isExpired && (
                                <span className="animate-pulse rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                                  ⚠️ Kedaluwarsa
                                </span>
                              )}
                            </div>

                            <h3
                              className={`text-xs font-semibold transition-colors line-clamp-2 ${
                                isExpired
                                  ? "text-red-900 group-hover:text-red-600"
                                  : "text-slate-800 group-hover:text-blue-600"
                              }`}
                            >
                              {medicine.name}
                            </h3>
                          </div>

                          <div className="mt-2 flex items-center justify-between border-t border-slate-50 pt-2">
                            <span className="text-xs font-bold text-slate-900">
                              {formatRupiah(medicine.price)}
                            </span>

                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                isExpired
                                  ? "bg-red-100 text-red-700 border border-red-200"
                                  : isOutOfStock
                                    ? "bg-red-50 text-red-600"
                                    : isLowStock
                                      ? "bg-amber-50 text-amber-600"
                                      : "bg-emerald-50 text-emerald-600"
                              }`}
                            >
                              {isExpired
                                ? "Expired"
                                : isOutOfStock
                                  ? "Habis"
                                  : `Stok: ${medicine.stock}`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 2. KERANJANG BELANJA */}
            <form
              onSubmit={handleSubmitTransaction}
              className="col-span-4 flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm overflow-hidden h-full"
            >
              <div className="mb-3 flex flex-shrink-0 items-center gap-2 border-b border-slate-100 pb-2">
                <ShoppingBag size={16} className="text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">Keranjang</h2>
                <span className="ml-auto rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} item
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
                {cart.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-slate-400 py-10">
                    <ShoppingBag
                      size={28}
                      className="mb-1 stroke-1 text-slate-300"
                    />
                    <p className="text-[11px]">Keranjang kosong</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col rounded-lg border border-slate-100 bg-slate-50/50 p-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-medium text-slate-800 truncate">
                            {item.name}
                          </h4>
                          <span className="text-[10px] text-slate-500">
                            {formatRupiah(item.price)}/pcs
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors ml-2"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          {formatRupiah(item.price * item.quantity)}
                        </span>
                        <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white p-0.5">
                          <button
                            type="button"
                            onClick={() => handleDecreaseQuantity(item.id)}
                            className="rounded bg-slate-50 p-0.5 text-slate-600 hover:bg-slate-100"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="w-4 text-center text-[11px] font-semibold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleAddToCart({
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                stock: item.stock,
                                category: item.category,
                              })
                            }
                            className="rounded bg-slate-50 p-0.5 text-slate-600 hover:bg-slate-100"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-3 border-t border-slate-100 pt-3 space-y-3 flex-shrink-0 bg-white">
                <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                  <span>Total Tagihan</span>
                  <span className="text-base text-blue-600">
                    {formatRupiah(totalAmount)}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <CreditCard size={10} /> Metode Pembayaran
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as PaymentMethod)
                    }
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-800 bg-white outline-none cursor-pointer"
                  >
                    <option value="CASH">💵 TUNAI (CASH)</option>
                    <option value="QRIS">📱 QRIS</option>
                    <option value="TRANSFER">🏦 BANK TRANSFER</option>
                    <option value="E_WALLET">💳 E-WALLET</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {paymentMethod === "CASH"
                      ? "Uang Dibayar Pasien"
                      : "Nominal Non-Tunai"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                      Rp
                    </span>
                    <input
                      type="number"
                      required
                      disabled={
                        cart.length === 0 ||
                        isSubmitting ||
                        paymentMethod !== "CASH"
                      }
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="0"
                      className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-3 text-xs text-slate-800 outline-none disabled:bg-slate-50"
                    />
                  </div>
                </div>

                {paymentMethod === "CASH" && (
                  <div className="flex justify-between rounded-lg bg-slate-50 p-2 text-xs border border-slate-100">
                    <span className="font-medium text-slate-600">
                      Kembalian
                    </span>
                    <span className="font-bold text-slate-800">
                      {formatRupiah(changeAmount)}
                    </span>
                  </div>
                )}

                {/* Button Submit */}
                <PrimaryButton
                  type="submit"
                  disabled={
                    cart.length === 0 ||
                    isSubmitting ||
                    // Jika CASH, pastikan uang yang diinput cukup.
                    // Jika NON-CASH (E-Wallet, dll), abaikan pengecekan input karena nominal otomatis pas.
                    (paymentMethod === "CASH" &&
                      (parseFloat(paymentAmount) || 0) < totalAmount)
                  }
                  className="w-full py-2.5 text-xs font-medium shadow-sm gap-2"
                >
                  {isSubmitting && (
                    <Loader2 className="animate-spin" size={14} />
                  )}
                  {isSubmitting ? "Memproses..." : "Selesaikan Transaksi"}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
