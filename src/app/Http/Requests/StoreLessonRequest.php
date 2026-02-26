<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLessonRequest extends FormRequest
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
            'content_type' => ['required', 'in:video,article,pdf'],
            'video_url' => ['nullable', 'string', 'max:500', 'required_without:video_file'], // Rule is complicated because of existing file case? 
            // Actually for Store: required_without:video_file if content_type is video.
            // But 'required_if' only checks one field.
            // Let's use more expressive logic or a closure?
            // Simple approach: nullable, but we validate manually or use complex rule.
            // 'video_url' => ['nullable', 'required_if:content_type,video', ...] -> this forces URL even if file is there.
            
            // Correct logic:
            'video_url' => ['nullable', 'string', 'url', 'max:500'],
            'video_file' => ['nullable', 'file', 'mimes:mp4,webm', 'max:102400'], // 100MB
            'pdf_file' => ['nullable', 'file', 'mimes:pdf', 'max:10240'], // 10MB
            'content' => ['required_if:content_type,article', 'nullable', 'string'],
            'duration' => ['nullable', 'integer', 'min:0'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
            'is_preview' => ['boolean'],
        ];
    }
}
