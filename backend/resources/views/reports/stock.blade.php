<!DOCTYPE html>
<html>

<head>

<meta charset="utf-8">

<style>

body{
    font-family: DejaVu Sans;
    font-size:12px;
}

table{
    width:100%;
    border-collapse:collapse;
}

th,td{
    border:1px solid #000;
    padding:6px;
}

th{
    background:#eeeeee;
}

h2{
    text-align:center;
}

</style>

</head>

<body>

<h2>Stock Report</h2>

<p>
Generated :
{{ now()->format('d-m-Y H:i') }}
</p>

<table>

<thead>

<tr>

<th>No</th>

<th>Kode</th>

<th>Nama</th>

<th>Kategori</th>

<th>Supplier</th>

<th>Stock</th>

<th>Minimum</th>

<th>Harga</th>

<th>Expired</th>

</tr>

</thead>

<tbody>

@foreach($medicines as $medicine)

<tr>

<td>{{ $loop->iteration }}</td>

<td>{{ $medicine->code }}</td>

<td>{{ $medicine->name }}</td>

<td>{{ $medicine->category?->name }}</td>

<td>{{ $medicine->supplier?->name }}</td>

<td>{{ $medicine->stock }}</td>

<td>{{ $medicine->minimum_stock }}</td>

<td>Rp {{ number_format($medicine->price) }}</td>

<td>

{{ \Carbon\Carbon::parse($medicine->expired_date)->format('d-m-Y') }}

</td>

</tr>

@endforeach

</tbody>

</table>

</body>

</html>