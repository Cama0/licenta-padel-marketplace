<?php

use Illuminate\Support\Facades\Route;

// Toate rutele non-API sunt servite de React SPA
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');
