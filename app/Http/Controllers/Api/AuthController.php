<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\PasswordResetMail;
use App\Mail\WelcomeMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'role' => 'user',
        ]);

        $this->safeMail($user->email, new WelcomeMail($user));

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
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

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Credențialele furnizate sunt incorecte.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Deconectat cu succes.']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        // mesaj generic ca sa nu se afle ce emailuri exista
        if (!$user) {
            return response()->json([
                'message' => 'Daca acest email exista in sistemul nostru, vei primi un link de resetare.',
            ]);
        }

        // token plain in email, hash in DB
        $token = Str::random(64);

        \DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'email' => $request->email,
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        $frontendUrl = config('app.frontend_url', config('app.url'));
        $resetUrl = "{$frontendUrl}/reset-password/{$token}?email=" . urlencode($request->email);

        $this->safeMail($request->email, new PasswordResetMail($user->name, $resetUrl));

        $response = ['message' => 'Daca acest email exista in sistemul nostru, vei primi un link de resetare.'];

        // in dev returnam link direct ca sa nu trebuiasca mail server
        if (app()->environment('local')) {
            $response['debug_reset_url'] = $resetUrl;
            $response['debug_note'] = 'Link returnat doar in mediul local pentru testare. In productie, ajunge doar pe email.';
        }

        return response()->json($response);
    }

    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string',
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $record = \DB::table('password_reset_tokens')
            ->where('email', $validated['email'])
            ->first();

        if (!$record) {
            return response()->json([
                'message' => 'Token invalid sau expirat. Te rog cere un nou link de reset.',
            ], 422);
        }

        if (!Hash::check($validated['token'], $record->token)) {
            return response()->json([
                'message' => 'Token invalid sau expirat. Te rog cere un nou link de reset.',
            ], 422);
        }

        // token expira dupa 60 min
        if (now()->diffInMinutes($record->created_at) > 60) {
            \DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();
            return response()->json([
                'message' => 'Token expirat. Te rog cere un nou link de reset.',
            ], 422);
        }

        $user = User::where('email', $validated['email'])->first();
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        // one-time use
        \DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();

        // delogare de pe toate device-urile
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Parola a fost resetata cu succes! Te poti conecta cu noua parola.',
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profilul a fost actualizat.',
            'user' => $user->fresh(),
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Parola curenta este incorecta.',
                'errors' => ['current_password' => ['Parola curenta este incorecta.']],
            ], 422);
        }

        $user->update(['password' => Hash::make($request->password)]);

        return response()->json([
            'message' => 'Parola a fost schimbata cu succes.',
        ]);
    }

    public function profileStats(Request $request)
    {
        $userId = $request->user()->id;

        return response()->json([
            'orders_count' => \App\Models\Order::where('user_id', $userId)->count(),
            'orders_delivered' => \App\Models\Order::where('user_id', $userId)->where('status', 'delivered')->count(),
            'buyback_requests_count' => \App\Models\BuybackRequest::where('user_id', $userId)->count(),
            'reviews_count' => \App\Models\Review::where('user_id', $userId)->count(),
            'wishlist_count' => \App\Models\Wishlist::where('user_id', $userId)->count(),
            'total_spent' => \App\Models\Order::where('user_id', $userId)
                ->whereIn('status', ['delivered', 'shipped', 'processing', 'confirmed'])
                ->sum('total'),
        ]);
    }
}
