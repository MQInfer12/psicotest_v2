<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            Tests_Seeder::class
        ]);

        $this->call([
            Test_Answers_Seeder::class
        ]);
    }
}
