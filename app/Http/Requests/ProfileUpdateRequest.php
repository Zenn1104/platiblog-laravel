<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['string', 'max:255'],
            'email' => ['string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
            'place_of_birth' => ['nullable', 'string', 'max:50'],
            'date_of_birth' => ['nullable', 'string', 'max:50'],
            'avatar' => ['nullable', 'image', 'mimes:jpg,png,webm,svg', 'max:2048'],
            'address' => ['nullable', 'string', 'max:255'],
        ];
    }
}
