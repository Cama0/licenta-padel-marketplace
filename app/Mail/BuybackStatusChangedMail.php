<?php

namespace App\Mail;

use App\Models\BuybackRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BuybackStatusChangedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public BuybackRequest $buybackRequest,
        public string $previousStatus,
    ) {}

    public function envelope(): Envelope
    {
        $statusText = $this->statusLabel($this->buybackRequest->status);
        return new Envelope(
            subject: "Cererea ta de buy-back: {$statusText}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.buyback-status-changed',
            with: [
                'request' => $this->buybackRequest,
                'newStatus' => $this->buybackRequest->status,
                'statusLabel' => $this->statusLabel($this->buybackRequest->status),
                'statusMessage' => $this->statusMessage($this->buybackRequest->status),
            ],
        );
    }

    private function statusLabel(string $status): string
    {
        return match ($status) {
            'pending' => 'In asteptare',
            'accepted' => 'Acceptata',
            'rejected' => 'Respinsa',
            'completed' => 'Finalizata',
            default => $status,
        };
    }

    private function statusMessage(string $status): string
    {
        return match ($status) {
            'accepted' => 'Cererea ta a fost acceptata! Te vom contacta in curand cu detaliile pentru trimiterea rachetei.',
            'rejected' => 'Din pacate, cererea ta nu a putut fi acceptata. Pentru detalii, te rugam sa ne contactezi.',
            'completed' => 'Tranzactia a fost finalizata cu succes. Multumim ca ai ales programul nostru de buy-back!',
            default => 'Statusul cererii tale a fost actualizat.',
        };
    }
}
