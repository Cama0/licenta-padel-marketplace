<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\BuybackController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EvaluationController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PadelRacketController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\RacketAdvisorController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\WishlistController;
use Illuminate\Support\Facades\Route;

// rute publice
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

Route::get('/brands', [BrandController::class, 'index']);
Route::get('/brands/{brand}', [BrandController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

Route::get('/padel-rackets', [PadelRacketController::class, 'index']);
Route::get('/padel-rackets/{padelRacket}', [PadelRacketController::class, 'show']);

Route::get('/evaluation-criteria', [EvaluationController::class, 'index']);

Route::post('/buyback/calculate-price', [BuybackController::class, 'calculatePrice']);

Route::get('/advisor/filter-options', [RacketAdvisorController::class, 'getFilterOptions']);
Route::post('/advisor/recommend', [RacketAdvisorController::class, 'recommend']);

Route::get('/products/{product}/reviews', [ReviewController::class, 'index']);

// rute autentificate
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/profile/password', [AuthController::class, 'changePassword']);
    Route::get('/profile/stats', [AuthController::class, 'profileStats']);

    Route::post('/buyback/requests', [BuybackController::class, 'store']);
    Route::get('/buyback/my-requests', [BuybackController::class, 'myRequests']);

    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/my', [OrderController::class, 'myOrders']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::get('/orders/{order}/invoice', [OrderController::class, 'downloadInvoice']);

    Route::get('/buyback/requests/{buybackRequest}/receipt', [BuybackController::class, 'downloadReceipt']);

    Route::post('/products/{product}/reviews', [ReviewController::class, 'store']);
    Route::get('/products/{product}/my-review', [ReviewController::class, 'myReviewForProduct']);
    Route::put('/reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::get('/wishlist/ids', [WishlistController::class, 'ids']);
    Route::post('/wishlist/{product}', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{product}', [WishlistController::class, 'destroy']);
    Route::post('/wishlist/{product}/toggle', [WishlistController::class, 'toggle']);
});

// rute admin
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard-stats', [DashboardController::class, 'stats']);

    Route::get('/products', [ProductController::class, 'adminIndex']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    Route::post('/brands', [BrandController::class, 'store']);
    Route::put('/brands/{brand}', [BrandController::class, 'update']);
    Route::delete('/brands/{brand}', [BrandController::class, 'destroy']);

    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    Route::get('/padel-rackets', [PadelRacketController::class, 'adminIndex']);
    Route::post('/padel-rackets', [PadelRacketController::class, 'store']);
    Route::put('/padel-rackets/{padelRacket}', [PadelRacketController::class, 'update']);
    Route::delete('/padel-rackets/{padelRacket}', [PadelRacketController::class, 'destroy']);

    Route::get('/evaluation-criteria', [EvaluationController::class, 'adminIndex']);
    Route::post('/evaluation-criteria', [EvaluationController::class, 'storeCriterion']);
    Route::put('/evaluation-criteria/{criterion}', [EvaluationController::class, 'updateCriterion']);
    Route::delete('/evaluation-criteria/{criterion}', [EvaluationController::class, 'destroyCriterion']);

    Route::post('/evaluation-criteria/{criterion}/options', [EvaluationController::class, 'storeOption']);
    Route::put('/evaluation-options/{option}', [EvaluationController::class, 'updateOption']);
    Route::delete('/evaluation-options/{option}', [EvaluationController::class, 'destroyOption']);

    Route::get('/buyback-requests', [BuybackController::class, 'adminIndex']);
    Route::get('/buyback-requests/{buybackRequest}', [BuybackController::class, 'adminShow']);
    Route::put('/buyback-requests/{buybackRequest}', [BuybackController::class, 'adminUpdate']);

    Route::get('/orders', [OrderController::class, 'adminIndex']);
    Route::get('/orders/{order}', [OrderController::class, 'adminShow']);
    Route::put('/orders/{order}', [OrderController::class, 'adminUpdate']);
    Route::get('/orders/{order}/invoice', [OrderController::class, 'downloadInvoice']);

    Route::get('/buyback-requests/{buybackRequest}/receipt', [BuybackController::class, 'downloadReceipt']);

    Route::get('/reviews', [ReviewController::class, 'adminIndex']);
    Route::put('/reviews/{review}', [ReviewController::class, 'adminUpdate']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'adminDestroy']);
});
