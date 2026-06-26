<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject ?? 'PadelMarket' }}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f3f4f6;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    {{-- Header --}}
                    <tr>
                        <td style="background: linear-gradient(135deg, #0f1720 0%, #1a2332 100%); padding: 32px 40px; text-align: center;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                                <tr>
                                    <td style="vertical-align: middle;">
                                        <span style="color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: 1px;">PADEL</span><span style="color: #10b981; font-size: 22px; font-weight: 700; letter-spacing: 1px;">MARKET</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- Content --}}
                    <tr>
                        <td style="padding: 40px;">
                            {{ $slot ?? '' }}
                            @yield('content')
                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px;">
                                © {{ date('Y') }} PadelMarket. Toate drepturile rezervate.
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                                Acest email a fost trimis automat. Te rugam sa nu raspunzi direct la el.<br>
                                Pentru intrebari: <a href="mailto:contact@padelmarket.ro" style="color: #10b981; text-decoration: none;">contact@padelmarket.ro</a>
                            </p>
                        </td>
                    </tr>
                </table>

                <p style="color: #9ca3af; font-size: 11px; margin-top: 16px; text-align: center;">
                    Cluj-Napoca, Romania
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
