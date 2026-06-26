<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // idempotent ca sa poata fi rulat de mai multe ori
        User::firstOrCreate(
            ['email' => 'admin@padel.ro'],
            [
                'name' => 'Admin',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ]
        );
    }
}
