<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $instructor = User::first();

        if (!$instructor) {
            return;
        }

        // Create Tags
        $tags = [
            ['name' => 'Laravel', 'slug' => 'laravel', 'color' => '#FF2D20'],
            ['name' => 'React', 'slug' => 'react', 'color' => '#61DAFB'],
            ['name' => 'TypeScript', 'slug' => 'typescript', 'color' => '#3178C6'],
            ['name' => 'TailwindCSS', 'slug' => 'tailwindcss', 'color' => '#06B6D4'],
            ['name' => 'Inertia', 'slug' => 'inertia', 'color' => '#9553E9'],
            ['name' => 'PHP', 'slug' => 'php', 'color' => '#777BB4'],
        ];

        foreach ($tags as $tag) {
            Tag::updateOrCreate(['slug' => $tag['slug']], $tag);
        }

        $allTags = Tag::all();

        // Create Courses
        $courses = [
            [
                'title' => 'Belajar Design System dengan React & Tailwind',
                'description' => 'Pelajari step by step membangun design system dari nol mulai dari design tokens, arsitektur komponen, aksesibilitas, theming, dan hal lain menarik lainnya.',
                'tags' => ['react', 'tailwindcss', 'typescript'],
                'lessons' => [
                    [
                        'title' => 'Introduction to Design Systems',
                        'content_type' => 'video',
                        'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        'content' => 'Overview of what we will build.',
                        'duration' => 600,
                    ],
                    [
                        'title' => 'Atomic Design Principles',
                        'content_type' => 'article',
                        'content' => "# Atomic Design\n\nAtomic design is a methodology for creating design systems. There are five distinct levels in atomic design:\n\n1. Atoms\n2. Molecules\n3. Organisms\n4. Templates\n5. Pages",
                        'duration' => 900,
                    ],
                    [
                        'title' => 'Setting up Tailwind CSS 4',
                        'content_type' => 'video',
                        'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        'content' => 'Installing and configuring the latest Tailwind.',
                        'duration' => 1200,
                    ],
                ]
            ],
            [
                'title' => 'Mastering Laravel 11',
                'description' => 'Kuasai Laravel 11 dengan fitur-fitur terbarunya seperti minimal configuration, new folder structure, dan performa yang lebih cepat.',
                'tags' => ['laravel', 'php'],
                'lessons' => [
                    [
                        'title' => 'New Directory Structure',
                        'content_type' => 'video',
                        'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        'content' => 'Exploring the streamlined directory in Laravel 11.',
                        'duration' => 800,
                    ],
                    [
                        'title' => 'Laravel Reverb',
                        'content_type' => 'article',
                        'content' => "# Laravel Reverb\n\nReverb is a first-party WebSocket server for Laravel applications, providing real-time communication between the client and server.",
                        'duration' => 1500,
                    ],
                ]
            ],
            [
                'title' => 'Modern Web with Inertia.js v2',
                'description' => 'Bangun aplikasi monolithic dengan cita rasa SPA menggunakan Inertia.js v2. Pelajari polling, prefetching, dan fitur baru lainnya.',
                'tags' => ['inertia', 'laravel', 'react'],
                'lessons' => [
                    [
                        'title' => 'What is new in Inertia v2',
                        'content_type' => 'video',
                        'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        'duration' => 700,
                    ],
                ]
            ]
        ];

        foreach ($courses as $courseData) {
            $course = Course::firstOrCreate(
                ['slug' => Str::slug($courseData['title'])],
                [
                    'instructor_id' => $instructor->id,
                    'title' => $courseData['title'],
                    'description' => $courseData['description'],
                    'is_published' => true,
                ]
            );

            // Sync tags
            $tagIds = $allTags->whereIn('slug', $courseData['tags'])->pluck('id');
            $course->tags()->sync($tagIds);

            // Create Lessons
            foreach ($courseData['lessons'] as $index => $lessonData) {
                Lesson::firstOrCreate(
                    [
                        'course_id' => $course->id,
                        'title' => $lessonData['title']
                    ],
                    array_merge($lessonData, ['order' => $index + 1])
                );
            }
        }
    }
}
