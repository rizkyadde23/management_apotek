<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
        }

        h2 {
            text-align: center;
            margin-bottom: 5px;
        }

        p {
            text-align: center;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        table th,
        table td {
            border: 1px solid #000;
            padding: 6px;
            font-size: 11px;
        }

        table th {
            background: #eeeeee;
        }
    </style>
</head>

<body>

<h2>Laporan Data Obat</h2>

<p>
    Dicetak :
    {{ now()->format('d M Y H:i') }}
</p>

<table>

    <thead>

    <tr>
        <th>Kode</th>

        <th>Nama</th>

        <th>Kategori</th>

        <th>Supplier</th>

        <th>Stock</th>

        <th>Min Stock</th>

        <th>Harga</th>

        <th>Expired</th>
    </tr>

    </thead>

    <tbody>

    @forelse($medicines as $medicine)

        <tr>

            <td>{{ $medicine->code }}</td>

            <td>{{ $medicine->name }}</td>

            <td>{{ $medicine->category?->name }}</td>

            <td>{{ $medicine->supplier?->name }}</td>

            <td>{{ $medicine->stock }}</td>

            <td>{{ $medicine->minimum_stock }}</td>

            <td>
                Rp {{ number_format($medicine->price,0,',','.') }}
            </td>

            <td>
                {{ optional($medicine->expired_date)->format('d-m-Y') }}
            </td>

        </tr>

    @empty

        <tr>

            <td colspan="8" align="center">
                Tidak ada data
            </td>

        </tr>

    @endforelse

    </tbody>

</table>

</body>

</html>