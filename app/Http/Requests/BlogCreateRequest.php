<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BlogCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:555'],
            'thumbnail' => ['required', 'file', 'mimes:png,jpg,jpeg,webm', 'max:2048'],
            'content' => ['required', 'string', 'min:10'],
            'category' => ['required'],
        ];
    }
}
