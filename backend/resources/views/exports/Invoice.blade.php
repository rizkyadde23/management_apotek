<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Struk Pembayaran - #TX-{{ str_pad($transaction->id, 5, '0', STR_PAD_LEFT) }}</title>
    <style>
        @page {
            size: auto;
            margin: 0mm;
        }
        body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
            background-color: #fff;
            padding: 15px;
            max-width: 300px; /* Standar Lebar Kertas Thermal */
            margin: 0 auto;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        
        .header {
            margin-bottom: 15px;
            border-bottom: 1px dashed #000;
            padding-bottom: 10px;
        }
        .header h2 {
            margin: 0 0 5px 0;
            font-size: 16px;
            text-transform: uppercase;
        }
        .header p { margin: 2px 0; font-size: 11px; }

        .info-table, .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .info-table td { padding: 2px 0; font-size: 11px; }
        
        .items-table th {
            border-bottom: 1px dashed #000;
            padding: 5px 0;
            font-size: 11px;
        }
        .items-table td { padding: 4px 0; vertical-align: top; }
        .divider {
            border-top: 1px dashed #000;
            margin: 5px 0;
        }

        .totals-table {
            width: 100%;
            margin-top: 5px;
        }
        .totals-table td { padding: 2px 0; }

        .footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px dashed #000;
            font-size: 10px;
        }
    </style>
</head>
<body>

    <!-- HEADER APOTEK -->
    <div class="header text-center">
        <h2>APOTEK SEHAT SEJAHTERA</h2>
        <p>Jl. Raya Farmasi No. 123, Indonesia</p>
        <p>Telp: (021) 555-1234</p>
    </div>

    <!-- DATA TRANSAKSI -->
    <table class="info-table">
        <tr>
            <td>No. Nota</td>
            <td>: TX-{{ str_pad($transaction->id, 5, '0', STR_PAD_LEFT) }}</td>
        </tr>
        <tr>
            <td>Tanggal</td>
            <td>: {{ $transaction->created_at->format('d/m/Y H:i') }} WIB</td>
        </tr>
        <tr>
            <td>Kasir</td>
            <td>: {{ $transaction->user->name ?? 'Apoteker Kasir' }}</td>
        </tr>
        <tr>
            <td>Metode</td>
            <td>: {{ $transaction->payment_method ?? 'CASH' }}</td>
        </tr>
    </table>

    <!-- DAFTAR ITEM OBAT -->
    <table class="items-table">
        <thead>
            <tr>
                <th align="left">Menu / Produk</th>
                <th align="center">Qty</th>
                <th align="right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transaction->items as $item)
                <tr>
                    <td colspan="3" class="font-bold">{{ $item->medicine->name }}</td>
                </tr>
                <tr>
                    <td style="font-size: 11px; color: #444;">
                        @ {{ number_format($item->medicine->price, 0, ',', '.') }}
                    </td>
                    <td align="center">{{ $item->quantity }}</td>
                    <td align="right">{{ number_format($item->quantity * $item->medicine->price, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="divider"></div>

    <!-- RINGKASAN TOTAL & KEMBALIAN -->
    <table class="totals-table">
        <tr>
            <td class="font-bold">TOTAL TAGIHAN</td>
            <td align="right" class="font-bold">
                Rp {{ number_format($transaction->items->sum(fn($i) => $i->quantity * $i->medicine->price), 0, ',', '.') }}
            </td>
        </tr>
        <tr>
            <td>Tunai / Bayar</td>
            <td align="right">
                Rp {{ number_format($transaction->amount_paid ?? $transaction->items->sum(fn($i) => $i->quantity * $i->medicine->price), 0, ',', '.') }}
            </td>
        </tr>
        @if(isset($transaction->amount_paid))
        <tr>
            <td>Kembalian</td>
            <td align="right">
                Rp {{ number_format(max(0, $transaction->amount_paid - $transaction->items->sum(fn($i) => $i->quantity * $i->medicine->price)), 0, ',', '.') }}
            </td>
        </tr>
        @endif
    </table>

    <!-- FOOTER STRUK -->
    <div class="footer text-center">
        <p class="font-bold">Terima Kasih Atas Kunjungan Anda</p>
        <p>Semoga Lekas Sembuh & Sehat Selalu</p>
        <p style="margin-top: 5px; font-size: 8px; color: #666;">Struk dicetak otomatis oleh Sistem Apotek</p>
    </div>
</body>
</html>