<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class RacketAdvisorController extends Controller
{
    // optiunile pentru intrebarile din chat
    public function getFilterOptions()
    {
        return response()->json([
            'playing_styles' => [
                ['value' => 'control', 'label' => 'Control', 'description' => 'Joc defensiv, precizie maximă, toleranță la erori'],
                ['value' => 'allround', 'label' => 'All-Round', 'description' => 'Echilibru între putere și control, versatilitate'],
                ['value' => 'attack', 'label' => 'Atac', 'description' => 'Putere maximă, smash-uri decisive, joc ofensiv'],
            ],
            'playing_levels' => [
                ['value' => 'beginner', 'label' => 'Începător', 'description' => 'Tocmai am început să joc padel'],
                ['value' => 'intermediate', 'label' => 'Intermediar', 'description' => 'Joc regulat, stăpânesc bazele'],
                ['value' => 'advanced', 'label' => 'Avansat', 'description' => 'Joc competitiv, tehnică solidă'],
                ['value' => 'professional', 'label' => 'Profesionist', 'description' => 'Nivel de competiție/turnee'],
            ],
            'shapes' => [
                ['value' => 'round', 'label' => 'Rotundă', 'description' => 'Sweet spot mare, control excelent, ideală pentru începători și control'],
                ['value' => 'teardrop', 'label' => 'Teardrop (Lacrimă)', 'description' => 'Echilibru între putere și control, cea mai populară formă'],
                ['value' => 'diamond', 'label' => 'Diamond (Diamant)', 'description' => 'Putere maximă, sweet spot sus, pentru jucători experimentați'],
                ['value' => 'geometric', 'label' => 'Geometrică', 'description' => 'Design modern, sweet spot optimizat, versatilă'],
            ],
            'balances' => [
                ['value' => 'low', 'label' => 'Balans jos (Mâner)', 'description' => 'Control superior, manevrabilitate excelentă'],
                ['value' => 'medium', 'label' => 'Balans mediu', 'description' => 'Echilibrat între putere și control'],
                ['value' => 'high', 'label' => 'Balans sus (Cap)', 'description' => 'Putere maximă la impact, ideal pentru atac'],
            ],
            'core_hardnesses' => [
                ['value' => 'soft', 'label' => 'Moale (Soft)', 'description' => 'Confort maxim, absorbție șocuri, control bun'],
                ['value' => 'medium', 'label' => 'Medie', 'description' => 'Echilibru între confort și reactivitate'],
                ['value' => 'hard', 'label' => 'Tare (Hard)', 'description' => 'Putere și reactivitate maximă, mai puțin confort'],
            ],
            'budget_ranges' => [
                ['value' => '0-500', 'label' => 'Sub 500 RON', 'min' => 0, 'max' => 500],
                ['value' => '500-800', 'label' => '500 - 800 RON', 'min' => 500, 'max' => 800],
                ['value' => '800-1200', 'label' => '800 - 1200 RON', 'min' => 800, 'max' => 1200],
                ['value' => '1200+', 'label' => 'Peste 1200 RON', 'min' => 1200, 'max' => 99999],
            ],
            'product_types' => [
                ['value' => '', 'label' => 'Ambele (Noi + Refurbished)'],
                ['value' => 'new', 'label' => 'Doar Noi'],
                ['value' => 'refurbished', 'label' => 'Doar Refurbished'],
            ],
        ]);
    }

    public function recommend(Request $request)
    {
        $request->validate([
            'playing_style' => 'nullable|string|in:control,allround,attack',
            'playing_level' => 'nullable|string|in:beginner,intermediate,advanced,professional',
            'shape' => 'nullable|string|in:round,teardrop,diamond,geometric',
            'balance' => 'nullable|string|in:low,medium,high',
            'core_hardness' => 'nullable|string|in:soft,medium,hard',
            'budget_min' => 'nullable|numeric|min:0',
            'budget_max' => 'nullable|numeric|min:0',
            'product_type' => 'nullable|string|in:new,refurbished',
            'brand_id' => 'nullable|integer|exists:brands,id',
        ]);

        // doar rachete cu specs tehnice in stoc
        $query = Product::with('brand', 'category')
            ->active()
            ->whereNotNull('playing_style')
            ->where('stock', '>', 0);

        if ($request->budget_min) {
            $query->where('price', '>=', $request->budget_min);
        }
        if ($request->budget_max) {
            $query->where('price', '<=', $request->budget_max);
        }

        if ($request->product_type) {
            $query->where('type', $request->product_type);
        }

        if ($request->brand_id) {
            $query->where('brand_id', $request->brand_id);
        }

        $products = $query->get();

        $scoredProducts = $products->map(function ($product) use ($request) {
            return $this->scoreProduct($product, $request);
        });

        $sorted = $scoredProducts
            ->sortByDesc('score')
            ->sortByDesc('match_percentage')
            ->values()
            ->take(6);

        // racheta premium peste buget
        $bonusRecommendation = null;
        $budgetMax = $request->budget_max ? floatval($request->budget_max) : null;

        if ($budgetMax && $budgetMax < 99999) {
            $bonusQuery = Product::with('brand', 'category')
                ->active()
                ->whereNotNull('playing_style')
                ->where('stock', '>', 0)
                ->where('price', '>', $budgetMax);

            if ($request->product_type) {
                $bonusQuery->where('type', $request->product_type);
            }
            if ($request->brand_id) {
                $bonusQuery->where('brand_id', $request->brand_id);
            }

            $bonusProducts = $bonusQuery->get();

            if ($bonusProducts->isNotEmpty()) {
                $scoredBonus = $bonusProducts->map(function ($product) use ($request) {
                    return $this->scoreProduct($product, $request);
                });

                $mainIds = $sorted->map(fn($item) => $item['product']->id)->toArray();

                // minim 30% potrivire si nu e deja in lista
                $bestBonus = $scoredBonus
                    ->filter(fn($item) => $item['match_percentage'] >= 30)
                    ->filter(fn($item) => !in_array($item['product']->id, $mainIds))
                    ->sortByDesc('score')
                    ->sortByDesc('match_percentage')
                    ->first();

                if ($bestBonus) {
                    $bonusRecommendation = $bestBonus;
                }
            }
        }

        $summary = $this->generateSummary($request, $sorted);

        return response()->json([
            'recommendations' => $sorted,
            'total_found' => $scoredProducts->count(),
            'summary' => $summary,
            'bonus_recommendation' => $bonusRecommendation,
        ]);
    }

    // algoritm scoring rachete
    private function scoreProduct(Product $product, Request $request): array
    {
        $score = 0;
        $maxScore = 0;
        $matchDetails = [];

        // stil de joc, pondere 30
        if ($request->playing_style) {
            $maxScore += 30;
            if ($product->playing_style === $request->playing_style) {
                $score += 30;
                $matchDetails[] = ['criterion' => 'Stil de joc', 'match' => 'perfect', 'points' => 30];
            } elseif ($product->playing_style === 'allround' || $request->playing_style === 'allround') {
                $score += 15;
                $matchDetails[] = ['criterion' => 'Stil de joc', 'match' => 'partial', 'points' => 15];
            } else {
                $matchDetails[] = ['criterion' => 'Stil de joc', 'match' => 'none', 'points' => 0];
            }
        }

        // nivel, pondere 20
        if ($request->playing_level) {
            $maxScore += 20;
            $levels = ['beginner' => 1, 'intermediate' => 2, 'advanced' => 3, 'professional' => 4];
            $requestedLevel = $levels[$request->playing_level] ?? 2;
            $productLevel = $levels[$product->playing_level] ?? 2;
            $diff = abs($requestedLevel - $productLevel);

            if ($diff === 0) {
                $score += 20;
                $matchDetails[] = ['criterion' => 'Nivel', 'match' => 'perfect', 'points' => 20];
            } elseif ($diff === 1) {
                $score += 12;
                $matchDetails[] = ['criterion' => 'Nivel', 'match' => 'partial', 'points' => 12];
            } else {
                $matchDetails[] = ['criterion' => 'Nivel', 'match' => 'none', 'points' => 0];
            }
        }

        // forma, pondere 15
        if ($request->shape) {
            $maxScore += 15;
            if ($product->shape === $request->shape) {
                $score += 15;
                $matchDetails[] = ['criterion' => 'Formă', 'match' => 'perfect', 'points' => 15];
            } elseif (
                ($request->shape === 'round' && $product->shape === 'teardrop') ||
                ($request->shape === 'teardrop' && in_array($product->shape, ['round', 'diamond'])) ||
                ($request->shape === 'diamond' && $product->shape === 'teardrop')
            ) {
                $score += 8;
                $matchDetails[] = ['criterion' => 'Formă', 'match' => 'partial', 'points' => 8];
            } else {
                $matchDetails[] = ['criterion' => 'Formă', 'match' => 'none', 'points' => 0];
            }
        }

        // balans, pondere 15
        if ($request->balance) {
            $maxScore += 15;
            if ($product->balance === $request->balance) {
                $score += 15;
                $matchDetails[] = ['criterion' => 'Balans', 'match' => 'perfect', 'points' => 15];
            } elseif ($product->balance === 'medium' || $request->balance === 'medium') {
                $score += 8;
                $matchDetails[] = ['criterion' => 'Balans', 'match' => 'partial', 'points' => 8];
            } else {
                $matchDetails[] = ['criterion' => 'Balans', 'match' => 'none', 'points' => 0];
            }
        }

        // duritate spuma, pondere 20
        if ($request->core_hardness) {
            $maxScore += 20;
            if ($product->core_hardness === $request->core_hardness) {
                $score += 20;
                $matchDetails[] = ['criterion' => 'Spumă', 'match' => 'perfect', 'points' => 20];
            } elseif ($product->core_hardness === 'medium' || $request->core_hardness === 'medium') {
                $score += 10;
                $matchDetails[] = ['criterion' => 'Spumă', 'match' => 'partial', 'points' => 10];
            } else {
                $matchDetails[] = ['criterion' => 'Spumă', 'match' => 'none', 'points' => 0];
            }
        }

        $percentage = $maxScore > 0 ? round(($score / $maxScore) * 100) : 0;

        return [
            'product' => $product,
            'score' => $score,
            'max_score' => $maxScore,
            'match_percentage' => $percentage,
            'match_details' => $matchDetails,
        ];
    }

    private function generateSummary(Request $request, $recommendations)
    {
        if ($recommendations->isEmpty()) {
            return 'Din păcate, nu am găsit rachete care să corespundă criteriilor tale. Încearcă să modifici bugetul sau să relaxezi filtrele.';
        }

        $top = $recommendations->first();
        $product = $top['product'];
        $percentage = $top['match_percentage'];

        $styleName = match ($request->playing_style) {
            'control' => 'control',
            'attack' => 'atac',
            'allround' => 'all-round',
            default => '',
        };

        $parts = [];

        if ($percentage >= 80) {
            $parts[] = "Am găsit o potrivire bună pentru tine.";
        } elseif ($percentage >= 60) {
            $parts[] = "Am găsit câteva opțiuni potrivite.";
        } else {
            $parts[] = "Am găsit câteva opțiuni care s-ar putea potrivi.";
        }

        $parts[] = "Recomandarea noastră principală este **{$product->brand->name} {$product->name}** ({$product->price} RON)";

        if ($percentage > 0) {
            $parts[] = "cu un grad de potrivire de **{$percentage}%**.";
        }

        $count = $recommendations->count();
        if ($count > 1) {
            $parts[] = "Am găsit în total **{$count} rachete** care se potrivesc cerințelor tale.";
        }

        return implode(' ', $parts);
    }
}
