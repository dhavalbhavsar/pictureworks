<?php

namespace Tests\Feature;

use App\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use WithFaker, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
    }

    /**
     * Test Task List
     *
     * @return void
     */
    public function testTaskList()
    {
        $response = $this->getJson('/api/task');

        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true
            ]);
    }

    /**
     * Store task
     *
     * @return void
     */
    public function testStoreTask()
    {
        $data = [
            'label' => $this->faker->text(10)
        ];

        $response = $this->postJson('/api/task', $data);

        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true
            ]);
    }

    /**
     * Store task required validation errors
     *
     * @return void
     */
    public function testStoreTaskRequiredValidationError()
    {
        $data = [
            'label' => ''
        ];

        $response = $this->postJson('/api/task', $data);

        $response->assertStatus(422);
    }

    /**
     * Update task
     *
     * @return void
     */
    public function testUpdateTask()
    {
        $task = factory(Task::class)->create();

        $data = [
            'label' => $this->faker->text(10)
        ];

        $response = $this->putJson('/api/task/'.$task->id, $data);

        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true
            ]);
    }


    /**
     * Update order
     *
     * @return void
     */
    public function testUpdateTaskOrder()
    {
        $task = factory(Task::class)->create();

        $data = [
            'sort_order' => [$task->id]
        ];

        $response = $this->postJson('/api/task/update-order', $data);

        $response
            ->assertStatus(200);
    }

}
