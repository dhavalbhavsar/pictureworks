<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Task;
use Faker\Generator as Faker;

$factory->define(Task::class, function (Faker $faker) {
	static $count = 1;  
	$count++; 
    return [
        'label' => $faker->unique()->text(10),
        'completed_at' => ($count % 2 === 0)?null:date('Y-m-d H:i:s',strtotime('tomorrow')),
    ];
});
