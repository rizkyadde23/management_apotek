<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">

    <style>
        body {
            font-family: DejaVu Sans;
            font-size: 12px;
        }

        h1 {
            text-align: center;
            margin-bottom: 5px;
        }

        h3 {
            text-align: center;
            margin-top: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        table th,
        table td {
            border: 1px solid black;
            padding: 6px;
        }

        table th {
            background: #e5e7eb;
        }

        .summary {
            margin-top: 20px;
        }

        .summary table td {
            border: none;
            padding: 3px;
        }
    </style>

</head>

<body>

    <h1>PHARMACY MANAGEMENT SYSTEM</h1>

    <h3>Sales Report</h3>

    <p>

        <strong>Generated :</strong>

        {{ now()->format('d M Y H:i') }}

    </p>

    @if(!empty($filters['start_date']))

        <p>

            <strong>Periode :</strong>

            {{ $filters['start_date'] }}

            -

            {{ $filters['end_date'] }}

        </p>

    @endif


    <div class="summary">

        <table>

            <tr>

                <td>Total Transaction</td>

                <td>{{ $summary['total_transactions'] }}</td>

            </tr>

            <tr>

                <td>Total Sales</td>

                <td>

                    Rp {{ number_format($summary['total_sales']) }}

                </td>

            </tr>

            <tr>

                <td>Total Discount</td>

                <td>

                    Rp {{ number_format($summary['total_discount']) }}

                </td>

            </tr>

            <tr>

                <td>Total Items Sold</td>

                <td>{{ $summary['total_items'] }}</td>

            </tr>

        </table>

    </div>

    <table>

        <thead>

            <tr>

                <th>No</th>

                <th>Invoice</th>

                <th>Date</th>

                <th>Cashier</th>

                <th>Status</th>

                <th>Total</th>

            </tr>

        </thead>

        <tbody>

            @foreach($transactions as $trx)

                <tr>

                    <td>{{ $loop->iteration }}</td>

                    <td>{{ $trx->transaction_code }}</td>

                    <td>{{ $trx->created_at->format('d-m-Y') }}</td>

                    <td>{{ $trx->user?->name }}</td>

                    <td>{{ $trx->payment_status }}</td>

                    <td>

                        Rp {{ number_format($trx->total) }}

                    </td>

                </tr>

            @endforeach

        </tbody>

    </table>

</body>

</html>