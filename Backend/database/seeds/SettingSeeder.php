<?php

use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        
        App\Setting::updateOrCreate(
            ['param' => 'allow_duplicates'],
            ['value' => 0]
        );
            
    }
}
