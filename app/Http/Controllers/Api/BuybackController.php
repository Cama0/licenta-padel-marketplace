<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\BuybackStatusChangedMail;
use App\Mail\BuybackSubmittedMail;
use App\Models\BuybackRequest;
use App\Models\EvaluationOption;
use App\Models\PadelRacket;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class BuybackController extends Controller
{
    // calcul pret estimat fara a salva
    public function calculatePrice(Request $request)
    {
        $validated = $request->validate([
            'padel_racket_id' => 'required|exists:padel_rackets,id',
            'selected_option_ids' => 'required|array|min:1',
            'selected_option_ids.*' => 'exists:evaluation_options,id',
        ]);

        $racket = PadelRacket::findOrFail($validated['padel_racket_id']);
        $options = EvaluationOption::whereIn('id', $validated['selected_option_ids'])->get();

        $price = $this->computePrice($racket->base_buyback_price, $options);

        return response()->json([
            'racket' => $racket->load('brand'),
            'base_price' => $racket->base_buyback_price,
            'deductions' => $options->map(fn ($opt) => [
                'label' => $opt->label,
                'type' => $opt->price_modifier_type,
                'value' => $opt->price_modifier_value,
                'amount' => $opt->price_modifier_type === 'percentage'
                    ? round($racket->base_buyback_price * $opt->price_modifier_value / 100, 2)
                    : $opt->price_modifier_value,
            ]),
            'offered_price' => $price,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'padel_racket_id' => 'required|exists:padel_rackets,id',
            'selected_option_ids' => 'required|array|min:1',
            'selected_option_ids.*' => 'exists:evaluation_options,id',
        ]);

        $racket = PadelRacket::findOrFail($validated['padel_racket_id']);
        $options = EvaluationOption::whereIn('id', $validated['selected_option_ids'])->get();

        $offeredPrice = $this->computePrice($racket->base_buyback_price, $options);

        $buybackRequest = BuybackRequest::create([
            'user_id' => $request->user()->id,
            'padel_racket_id' => $racket->id,
            'offered_price' => $offeredPrice,
            'status' => 'pending',
        ]);

        foreach ($validated['selected_option_ids'] as $optionId) {
            $buybackRequest->answers()->create([
                'evaluation_option_id' => $optionId,
            ]);
        }

        $buybackRequest->load(['user', 'padelRacket.brand']);
        if ($buybackRequest->user?->email) {
            $this->safeMail($buybackRequest->user->email, new BuybackSubmittedMail($buybackRequest));
        }

        return response()->json(
            $buybackRequest->load(['padelRacket.brand', 'selectedOptions.criterion']),
            201
        );
    }

    public function downloadReceipt(Request $request, BuybackRequest $buybackRequest)
    {
        if ($buybackRequest->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Nu aveti acces la aceasta cerere.'], 403);
        }

        $buybackRequest->load(['user', 'padelRacket.brand', 'selectedOptions.criterion']);

        $requestNumber = 'BB-' . $buybackRequest->created_at->format('Ymd') . '-' . str_pad($buybackRequest->id, 4, '0', STR_PAD_LEFT);

        $pdf = Pdf::loadView('pdfs.buyback-receipt', [
            'request' => $buybackRequest,
            'documentTitle' => "Cerere buy-back {$requestNumber}",
        ])->setPaper('a4');

        $filename = "buyback-{$requestNumber}.pdf";
        return $pdf->download($filename);
    }

    // trimite email cu try/catch ca sa nu blocheze fluxul
    private function safeMail(string $to, $mailable): void
    {
        try {
            Mail::to($to)->send($mailable);
        } catch (\Exception $e) {
            Log::warning('Email send failed: ' . $e->getMessage(), [
                'to' => $to,
                'mailable' => get_class($mailable),
            ]);
        }
    }

    public function myRequests(Request $request)
    {
        $requests = BuybackRequest::with(['padelRacket.brand', 'selectedOptions'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($requests);
    }

    public function adminIndex(Request $request)
    {
        $query = BuybackRequest::with(['user', 'padelRacket.brand', 'selectedOptions.criterion']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json(
            $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 15))
        );
    }

    public function adminShow(BuybackRequest $buybackRequest)
    {
        return response()->json(
            $buybackRequest->load(['user', 'padelRacket.brand', 'selectedOptions.criterion'])
        );
    }

    public function adminUpdate(Request $request, BuybackRequest $buybackRequest)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,accepted,rejected,completed',
            'admin_notes' => 'nullable|string',
        ]);

        $previousStatus = $buybackRequest->status;
        $buybackRequest->update($validated);

        if ($validated['status'] !== $previousStatus) {
            $buybackRequest->load('user');
            if ($buybackRequest->user?->email) {
                $this->safeMail(
                    $buybackRequest->user->email,
                    new BuybackStatusChangedMail($buybackRequest->fresh(), $previousStatus)
                );
            }
        }

        return response()->json(
            $buybackRequest->load(['user', 'padelRacket.brand', 'selectedOptions.criterion'])
        );
    }

    // algoritm de calcul pret
    private function computePrice(float $basePrice, $options): float
    {
        $finalPrice = $basePrice;

        foreach ($options as $option) {
            if ($option->price_modifier_type === 'percentage') {
                $finalPrice += $basePrice * $option->price_modifier_value / 100;
            } else {
                $finalPrice += $option->price_modifier_value;
            }
        }

        return max(round($finalPrice, 2), 0);
    }
}
