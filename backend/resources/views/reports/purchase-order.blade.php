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

<h2>Purchase Order Report</h2>

<p>

Generated :
{{ now()->format('d-m-Y H:i') }}

</p>

<table>

<thead>

<tr>

<th>No</th>

<th>PO Number</th>

<th>Supplier</th>

<th>Created By</th>

<th>Status</th>

<th>Date</th>

</tr>

</thead>

<tbody>

@foreach($purchaseOrders as $po)

<tr>

<td>{{ $loop->iteration }}</td>

<td>{{ $po->po_number }}</td>

<td>{{ $po->supplier?->name }}</td>

<td>{{ $po->creator?->name }}</td>

<td>{{ $po->status }}</td>

<td>{{ $po->created_at->format('d-m-Y') }}</td>

</tr>

@endforeach

</tbody>

</table>

</body>

</html>