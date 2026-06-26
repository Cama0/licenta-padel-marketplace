<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EvaluationCriterion;
use App\Models\EvaluationOption;
use Illuminate\Http\Request;

class EvaluationController extends Controller
{
    public function index()
    {
        $criteria = EvaluationCriterion::active()
            ->with('options')
            ->orderBy('sort_order')
            ->get();

        return response()->json($criteria);
    }

    public function adminIndex()
    {
        $criteria = EvaluationCriterion::with('options')
            ->orderBy('sort_order')
            ->get();

        return response()->json($criteria);
    }

    public function storeCriterion(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $criterion = EvaluationCriterion::create($validated);

        return response()->json($criterion, 201);
    }

    public function updateCriterion(Request $request, EvaluationCriterion $criterion)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $criterion->update($validated);

        return response()->json($criterion->load('options'));
    }

    public function destroyCriterion(EvaluationCriterion $criterion)
    {
        $criterion->delete();

        return response()->json(['message' => 'Criteriu șters cu succes.']);
    }

    public function storeOption(Request $request, EvaluationCriterion $criterion)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'price_modifier_type' => 'required|in:percentage,fixed_amount',
            'price_modifier_value' => 'required|numeric',
            'sort_order' => 'integer',
        ]);

        $validated['criterion_id'] = $criterion->id;

        $option = EvaluationOption::create($validated);

        return response()->json($option, 201);
    }

    public function updateOption(Request $request, EvaluationOption $option)
    {
        $validated = $request->validate([
            'label' => 'sometimes|required|string|max:255',
            'price_modifier_type' => 'sometimes|required|in:percentage,fixed_amount',
            'price_modifier_value' => 'sometimes|required|numeric',
            'sort_order' => 'integer',
        ]);

        $option->update($validated);

        return response()->json($option);
    }

    public function destroyOption(EvaluationOption $option)
    {
        $option->delete();

        return response()->json(['message' => 'Opțiune ștearsă cu succes.']);
    }
}
