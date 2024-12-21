<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WriterJoinRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:15',
            'place_of_birth' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'address' => 'required|string',
            'avatar' => 'nullable|image|max:2048', // avatar harus berupa file gambar
            'gender' => 'required|string|in:male,female',
            'job' => 'required|string|max:255',
            'last_education' => 'required|string|max:255',
            'description' => 'nullable|string',
        ];
    }
}
