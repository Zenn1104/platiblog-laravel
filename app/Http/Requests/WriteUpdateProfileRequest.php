<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WriteUpdateProfileRequest extends FormRequest
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
            'name' => ['max:100', 'string'],
            'email' => ['email'],
            'place_of_birth' => ['string', 'max:50'],
            'date_of_birth' => ['string', 'max:50'],
            'address' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:15'],
            'avatar' => ['file', 'mimes:jpg,png,webm,svg', 'max:2048'],
            'job' => ['string', 'max:100'],
            'last_education' => ['string', 'max:100'],
            'description' => ['string', 'max:500'],
        ];
    }
}
