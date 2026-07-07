<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ComplaintController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SparepartController;
use App\Http\Controllers\Api\TechnicianController;
use App\Http\Controllers\Api\WarrantyController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/services', [ServiceController::class, 'index']);

// Authenticated routes (any role)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::get('/spareparts', [SparepartController::class, 'index']);
});

// Customer routes
Route::middleware(['auth:sanctum', 'role:customer'])->prefix('customer')->group(function () {
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'customerIndex']);
    Route::post('/orders/{order}/approve', [OrderController::class, 'approve']);
    Route::post('/orders/{order}/rate', [RatingController::class, 'store']);
    Route::post('/orders/{order}/complaint', [ComplaintController::class, 'store']);
    Route::get('/warranties', [WarrantyController::class, 'index']);
    Route::post('/warranties/{warranty}/claim', [WarrantyController::class, 'claim']);
});

// Technician routes
Route::middleware(['auth:sanctum', 'role:technician'])->prefix('technician')->group(function () {
    Route::get('/profile', [TechnicianController::class, 'profile']);
    Route::put('/profile', [TechnicianController::class, 'updateProfile']);
    Route::post('/toggle-status', [TechnicianController::class, 'toggleStatus']);
    Route::get('/dashboard', [TechnicianController::class, 'dashboard']);
    Route::get('/orders', [OrderController::class, 'technicianIndex']);
    Route::post('/orders/{order}/accept', [OrderController::class, 'accept']);
    Route::post('/orders/{order}/diagnosis', [OrderController::class, 'submitDiagnosis']);
    Route::post('/orders/{order}/status', [OrderController::class, 'updateStatus']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/users', [AdminController::class, 'users']);
    Route::post('/technicians/{technician}/verify', [AdminController::class, 'verifyTechnician']);
    Route::delete('/users/{user}', [AdminController::class, 'deleteUser']);
    Route::get('/orders', [AdminController::class, 'orders']);
    Route::get('/complaints', [AdminController::class, 'complaints']);
    Route::put('/complaints/{complaint}', [AdminController::class, 'resolveComplaint']);
    Route::get('/spareparts', [SparepartController::class, 'index']);
    Route::post('/spareparts', [SparepartController::class, 'store']);
    Route::put('/spareparts/{sparepart}', [SparepartController::class, 'update']);
    Route::delete('/spareparts/{sparepart}', [SparepartController::class, 'destroy']);
});
