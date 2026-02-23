<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLessonRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'content_type' => ['required', 'in:video,article'],
            'video_url' => ['nullable', 'string', 'url', 'max:500'],
            'video_file' => ['nullable', 'file', 'mimes:mp4,webm', 'max:102400'],
            'content' => ['required_if:content_type,article', 'nullable', 'string'],
            'duration' => ['nullable', 'integer', 'min:0'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
            'is_preview' => ['boolean'],
        ];
    }
}
