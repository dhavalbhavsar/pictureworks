<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\BaseController;
use App\Http\Requests\SaveTaskRequest;
use App\Http\Requests\SortOrderTaskRequest;
use App\Task;

class TaskController extends BaseController
{

    protected $task;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $tasks = $this->task->orderBy('sort_order','ASC')->get();

        return $this->sendResponse($tasks, 'Task listing.');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  App\Http\Requests\SaveTaskRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(SaveTaskRequest $request)
    {

        $task = $this->task->create([
            'label' => $request->get('label')
        ]);

        return $this->sendResponse($task, 'Task created successfully.');
    }

    /**
     * Display the specified resource.
     *
     * @param Task $task
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
        return $this->sendResponse($task, 'Task details.');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  App\Http\Requests\SaveTaskRequest  $request
     * @param  App\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function update(SaveTaskRequest $request, Task $task)
    {

        $data = [
            'label' => $request->get('label')
        ];

        $task->update($data);

        return $this->sendResponse($task, 'Task has been updated.');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  App\Http\Requests\SortOrderTaskRequest  $request
     * @param  App\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function updateOrder(SortOrderTaskRequest $request)
    {
        if($request->get('sort_order')){
            $sortOrder = $request->get('sort_order');
            foreach($sortOrder as $key => $task){
                $task = Task::find($task);
                $task->sort_order = ($key + 1);
                $task->save();
            }
        }

        $tasks = $this->task->orderBy('sort_order','ASC')->get();

        return $this->sendResponse($tasks, 'Task order has been updated.');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  App\Task  $task
     * @param  $type (complete, incomplete)
     * @return \Illuminate\Http\Response
     */
    public function updateCompleted($id, $type)
    {
        $task = Task::find($id);

        $data = [
            'completed_at' => null
        ];

        if($type === 'complete'){
            $data['completed_at'] = now();
        }

        $task->update($data);

        return $this->sendResponse($task, 'Task completed has been updated.');
    }

}