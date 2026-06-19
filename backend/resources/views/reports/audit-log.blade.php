<!DOCTYPE html>
<html>

<head>

<meta charset="utf-8">

<style>

body{
font-family:DejaVu Sans;
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
background:#eee;
}

h2{
text-align:center;
}

</style>

</head>

<body>

<h2>Audit Log Report</h2>

<p>

Generated :
{{ now()->format('d-m-Y H:i') }}

</p>

<table>

<thead>

<tr>

<th>No</th>

<th>Tanggal</th>

<th>User</th>

<th>Action</th>

<th>Model</th>

<th>Description</th>

</tr>

</thead>

<tbody>

@foreach($logs as $log)

<tr>

<td>{{ $loop->iteration }}</td>

<td>{{ $log->created_at->format('d-m-Y H:i') }}</td>

<td>{{ $log->user?->name }}</td>

<td>{{ $log->action }}</td>

<td>{{ $log->model }}</td>

<td>{{ $log->description }}</td>

</tr>

@endforeach

</tbody>

</table>

</body>

</html>