<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderStatusChangedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order,
        public string $previousStatus,
    ) {}

    public function envelope(): Envelope
    {
        $statusText = $this->statusLabel($this->order->status);
        return new Envelope(
            subject: "Comanda {$this->order->order_number} - {$statusText}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.order-status-changed',
            with: [
                'order' => $this->order,
                'previousStatus' => $this->previousStatus,
                'newStatus' => $this->order->status,
                'statusLabel' => $this->statusLabel($this->order->status),
                'statusMessage' => $this->statusMessage($this->order->status),
            ],
        );
    }

    private function statusLabel(string $status): string
    {
        return match ($status) {
            'pending' => 'Plasata',
            'confirmed' => 'Confirmata',
            'processing' => 'In procesare',
            'shipped' => 'Expediata',
            'delivered' => 'Livrata',
            'cancelled' => 'Anulata',
            default => $status,
        };
    }

    private function statusMessage(string $status): string
    {
        return match ($status) {
            'confirmed' => 'Comanda ta a fost confirmata. O vom procesa in curand.',
            'processing' => 'Pregatim comanda ta pentru livrare.',
            'shipped' => 'Comanda ta a fost expediata. Vei primi in curand de la curier.',
            'delivered' => 'Comanda ta a fost livrata cu succes! Multumim ca ai ales PadelMarket.',
            'cancelled' => 'Comanda ta a fost anulata. Daca ai facut plata, vei primi banii inapoi in 1-3 zile lucratoare.',
            default => 'Statusul comenzii tale a fost actualizat.',
        };
    }
}
