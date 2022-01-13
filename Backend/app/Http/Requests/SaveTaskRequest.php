<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use App\Setting;

class SaveTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'label' => $this->getLabelRules()
        ];
    }

    private function getLabelRules()
    {

        $rules = ['required','max:255'];

        $settingValue = Setting::where('param','allow_duplicates')->value('value');

        if(isset($settingValue)){

            if($settingValue === '0'){

                $lableUniquerule = Rule::unique('tasks', 'label');

                if(!empty($this->task->id)){                
                    $lableUniquerule = $lableUniquerule->ignore($this->task->id);
                }

                $rules[] = $lableUniquerule;
            }

        }

        return $rules;
    }

}