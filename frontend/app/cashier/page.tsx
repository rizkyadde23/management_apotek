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
      const token = localStorage.getItem("token");

      const response = await api.get("/medicines", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response.data.data.data);
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

    // 1. Ambil token di awal dan simpan ke variabel lokal agar aman
    const savedToken = localStorage.getItem("auth_token");
    console.log("Token terdeteksi sebelum transaksi mulai:", savedToken);

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
          headers: { Authorization: `Bearer ${savedToken}` }, // Gunakan variabel lokal savedToken
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
        headers: { Authorization: `Bearer ${savedToken}` }, // Gunakan variabel lokal savedToken
      });

      alert("Transaksi & Pembayaran Sukses Dikonfirmasi!");

      // -------------------------------------------------------
      // TAHAP C: Cetak Struk Menggunakan Window Open + Token URL
      // -------------------------------------------------------
      // Di sini kita kirim variabel savedToken yang dijamin nilainya masih ada
      const baseURL = api.defaults.baseURL || "http://localhost:8000/api";
      window.open(
        `${baseURL}/transactions/${transactionId}/invoice?token=${encodeURIComponent(savedToken)}`,
        "_blank",
      );

      // -------------------------------------------------------
      // TAHAP D: Reset State Form (HATI-HATI JANGAN HAPUS TOKEN!)
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
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex flex-1 flex-col overflow-hidden p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Kasir Apotek
            </h1>
            <p className="text-sm text-slate-500">
              Eksekusi transaksi obat aman terkendali oleh Apoteker.
            </p>
          </div>

          <div className="flex flex-1 gap-6 overflow-hidden">
            {/* KATALOG OBAT */}
            <div className="flex flex-1 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Cari obat berdasarkan nama produk atau kategori..."
              />

              <div className="flex-1 overflow-y-auto pr-2">
                {isLoadingMedicines ? (
                  <div className="flex h-full flex-col items-center justify-center text-slate-400 gap-2">
                    <Loader2 className="animate-spin text-blue-600" size={28} />
                    <p className="text-sm">Menghubungkan ke server apotek...</p>
                  </div>
                ) : filteredMedicines.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <p className="text-sm">
                      Obat tidak tersedia atau kata kunci salah.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredMedicines.map((medicine) => {
                      const isOutOfStock = medicine.stock === 0;
                      const isLowStock =
                        medicine.stock > 0 && medicine.stock <= 10;
                      const categoryName =
                        typeof medicine.category === "object"
                          ? medicine.category.name
                          : medicine.category || "Umum";

                      return (
                        <div
                          key={medicine.id}
                          onClick={() =>
                            !isOutOfStock && handleAddToCart(medicine)
                          }
                          className={`group flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 ${
                            isOutOfStock
                              ? "border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed"
                              : "cursor-pointer border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm active:scale-[0.98]"
                          }`}
                        >
                          <div>
                            <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 mb-2">
                              {categoryName}
                            </span>
                            <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                              {medicine.name}
                            </h3>
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
                            <span className="font-bold text-slate-900">
                              {formatRupiah(medicine.price)}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${isOutOfStock ? "bg-red-50 text-red-600" : isLowStock ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}
                            >
                              {isOutOfStock
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

            {/* KERANJANG BELANJA & INTEGRASI CHECKOUT */}
            <form
              onSubmit={handleSubmitTransaction}
              className="flex w-96 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden"
            >
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <ShoppingBag size={18} className="text-blue-600" />
                  <h2 className="font-bold text-slate-900">
                    Keranjang Belanja
                  </h2>
                  <span className="ml-auto rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-600">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} item
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {cart.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-slate-400">
                      <ShoppingBag
                        size={32}
                        className="mb-2 stroke-1 text-slate-300"
                      />
                      <p className="text-xs">Keranjang kosong</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col rounded-xl border border-slate-100 bg-slate-50/50 p-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-slate-800 line-clamp-1">
                              {item.name}
                            </h4>
                            <span className="text-xs text-slate-500">
                              {formatRupiah(item.price)} / pcs
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900">
                            {formatRupiah(item.price * item.quantity)}
                          </span>
                          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1">
                            <button
                              type="button"
                              onClick={() => handleDecreaseQuantity(item.id)}
                              className="rounded bg-slate-50 p-1 text-slate-600 hover:bg-slate-100"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-xs font-semibold text-slate-800">
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
                              className="rounded bg-slate-50 p-1 text-slate-600 hover:bg-slate-100"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* RINGKASAN PEMBAYARAN KASIR */}
              <div className="mt-4 border-t border-slate-100 pt-4 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span>{formatRupiah(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-3 text-base font-bold text-slate-900">
                    <span>Total Tagihan</span>
                    <span className="text-blue-600">
                      {formatRupiah(totalAmount)}
                    </span>
                  </div>
                </div>

                {/* PILIHAN DROPDOWN METODE PEMBAYARAN */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                    <CreditCard size={12} /> Metode Pembayaran
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as PaymentMethod)
                    }
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 bg-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                  >
                    <option value="CASH">💵 TUNAI (CASH)</option>
                    <option value="QRIS">📱 QRIS</option>
                    <option value="TRANSFER">🏦 TRANSFER BANK</option>
                    <option value="E_WALLET">💳 E-WALLET</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {paymentMethod === "CASH"
                      ? "Uang Dibayar Pasien"
                      : "Nominal Non-Tunai"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
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
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {paymentMethod === "CASH" && (
                  <div className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm border border-slate-100">
                    <span className="font-medium text-slate-600">
                      Kembalian
                    </span>
                    <span className="font-bold text-slate-800">
                      {formatRupiah(changeAmount)}
                    </span>
                  </div>
                )}

                <PrimaryButton
                  type="submit"
                  disabled={
                    cart.length === 0 ||
                    (parseFloat(paymentAmount) || 0) < totalAmount ||
                    isSubmitting
                  }
                  className="w-full py-3.5 shadow-md shadow-blue-100 gap-2"
                >
                  {isSubmitting && (
                    <Loader2 className="animate-spin" size={16} />
                  )}
                  {isSubmitting
                    ? "Memproses..."
                    : "Selesaikan Transaksi & Struk"}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
