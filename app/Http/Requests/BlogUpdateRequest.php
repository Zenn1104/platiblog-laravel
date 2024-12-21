<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BlogUpdateRequest extends FormRequest
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
            'title' => ['string', 'max:555'],
            'thumbnail' => ['file', 'mimes:png,jpg,jpeg,webm', 'max:2048'],
            'content' => ['string', 'min:10'],
            'category' => ['required'],
        ];
    }
}
