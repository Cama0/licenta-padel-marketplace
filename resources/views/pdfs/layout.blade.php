<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <title>{{ $documentTitle ?? 'Document PadelMarket' }}</title>
    <style>
        /* Reset si setari de baza pentru DomPDF */
        * {
            font-family: DejaVu Sans, sans-serif;
            box-sizing: border-box;
        }
        body {
            margin: 0;
            padding: 0;
            color: #1a2332;
            font-size: 11px;
            line-height: 1.5;
        }
        .page {
            padding: 35px 40px;
        }

        /* Header cu logo */
        .header {
            border-bottom: 3px solid #10b981;
            padding-bottom: 16px;
            margin-bottom: 25px;
        }
        .header table {
            width: 100%;
            border-collapse: collapse;
        }
        .logo-text {
            font-size: 22px;
            font-weight: bold;
            letter-spacing: 1px;
        }
        .logo-text .accent {
            color: #10b981;
        }
        .company-info {
            text-align: right;
            font-size: 9px;
            color: #6b7280;
            line-height: 1.6;
        }

        /* Titluri */
        h1 {
            margin: 0 0 4px 0;
            font-size: 20px;
            font-weight: bold;
            color: #1a2332;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .doc-meta {
            font-size: 10px;
            color: #6b7280;
            margin-bottom: 22px;
        }
        .doc-number {
            font-family: monospace;
            font-weight: bold;
            color: #1a2332;
        }

        h2 {
            font-size: 11px;
            font-weight: bold;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 22px 0 8px 0;
            padding-bottom: 4px;
            border-bottom: 1px solid #e5e7eb;
        }

        /* Adrese / blocuri info side-by-side */
        .info-row {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
        }
        .info-row td {
            vertical-align: top;
            padding: 0;
            width: 50%;
        }
        .info-row td.right { padding-left: 20px; }

        .info-block {
            background-color: #f9fafb;
            padding: 12px 14px;
            border-radius: 6px;
            border-left: 3px solid #10b981;
        }
        .info-block .label {
            font-size: 9px;
            text-transform: uppercase;
            color: #6b7280;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        .info-block strong { color: #1a2332; }

        /* Tabele de items */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 12px 0;
        }
        .items-table thead {
            background-color: #1a2332;
            color: #ffffff;
        }
        .items-table th {
            padding: 9px 12px;
            text-align: left;
            font-size: 9px;
            font-weight: normal;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .items-table th.right { text-align: right; }
        .items-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #f3f4f6;
        }
        .items-table td.right { text-align: right; }
        .items-table tr:nth-child(even) td {
            background-color: #fafafa;
        }
        .items-table .product-meta {
            font-size: 9px;
            color: #9ca3af;
            margin-top: 2px;
        }

        /* Totaluri */
        .totals-table {
            width: 50%;
            margin-left: auto;
            border-collapse: collapse;
            margin-top: 12px;
        }
        .totals-table td {
            padding: 5px 12px;
            font-size: 11px;
        }
        .totals-table td.label {
            text-align: right;
            color: #6b7280;
        }
        .totals-table td.value {
            text-align: right;
            font-weight: bold;
            color: #1a2332;
            width: 100px;
        }
        .totals-table tr.grand-total td {
            border-top: 2px solid #1a2332;
            padding-top: 10px;
            font-size: 14px;
            color: #10b981;
        }
        .totals-table tr.grand-total td.label {
            font-weight: bold;
            color: #1a2332;
        }

        /* Status badges */
        .badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .badge-success { background-color: #d1fae5; color: #065f46; }
        .badge-warning { background-color: #fef3c7; color: #92400e; }
        .badge-info { background-color: #dbeafe; color: #1e40af; }
        .badge-danger { background-color: #fee2e2; color: #991b1b; }
        .badge-neutral { background-color: #f3f4f6; color: #374151; }

        /* Lista evaluare buyback */
        .eval-list {
            width: 100%;
            border-collapse: collapse;
            margin: 8px 0;
        }
        .eval-list td {
            padding: 7px 12px;
            border-bottom: 1px solid #f3f4f6;
        }
        .eval-list td.criterion { color: #6b7280; width: 50%; }
        .eval-list td.answer { font-weight: bold; }

        /* Footer */
        .footer {
            position: fixed;
            bottom: 20px;
            left: 40px;
            right: 40px;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
            font-size: 8px;
            color: #9ca3af;
            text-align: center;
        }

        .text-muted { color: #9ca3af; }
        .text-right { text-align: right; }
        .mb-0 { margin-bottom: 0; }
        .mt-0 { margin-top: 0; }
    </style>
</head>
<body>
    <div class="page">
        {{-- Header comun --}}
        <div class="header">
            <table>
                <tr>
                    <td>
                        <div class="logo-text">PADEL<span class="accent">MARKET</span></div>
                        <div style="font-size: 10px; color: #6b7280; margin-top: 4px;">
                            Magazin online echipament padel
                        </div>
                    </td>
                    <td class="company-info">
                        PadelMarket SRL<br>
                        Cluj-Napoca, Romania<br>
                        contact@padelmarket.ro<br>
                        +40 721 000 000
                    </td>
                </tr>
            </table>
        </div>

        @yield('content')

        {{-- Footer --}}
        <div class="footer">
            Document generat automat la {{ now()->format('d.m.Y H:i') }} · PadelMarket SRL · contact@padelmarket.ro
        </div>
    </div>
</body>
</html>
