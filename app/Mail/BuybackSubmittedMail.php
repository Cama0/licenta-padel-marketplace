<?php

namespace App\Mail;

use App\Models\BuybackRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BuybackSubmittedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public BuybackRequest $buybackRequest) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Cererea ta de buy-back a fost primita",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.buyback-submitted',
            with: ['buybackRequest' => $this->buybackRequest],
        );
    }
}
