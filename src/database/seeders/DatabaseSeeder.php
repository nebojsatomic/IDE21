<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

        $path = 'ide21-seed-default.sql';
        DB::unprepared(file_get_contents($path));
        $this->command->info('Default data seeded!');
    }
}
