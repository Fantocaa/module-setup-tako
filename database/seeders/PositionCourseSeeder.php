<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Position;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PositionCourseSeeder extends Seeder
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

        // Ensure Tags Exist
        $tagsData = [
            ['name' => 'Marketing', 'slug' => 'marketing', 'color' => '#E91E63'],
            ['name' => 'Management', 'slug' => 'management', 'color' => '#9C27B0'],
            ['name' => 'Development', 'slug' => 'development', 'color' => '#2196F3'],
            ['name' => 'Design', 'slug' => 'design', 'color' => '#FF9800'],
            ['name' => 'Office', 'slug' => 'office', 'color' => '#4CAF50'],
            ['name' => 'SEO', 'slug' => 'seo', 'color' => '#795548'],
        ];

        foreach ($tagsData as $tag) {
            Tag::updateOrCreate(['slug' => $tag['slug']], $tag);
        }

        $longMarkdown = "# Comprehensive Guide to Modern Professionalism\n\n" . str_repeat("## Section Title\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n", 20) . "\n\n### Conclusion\n\nFinal thoughts on the matter after a very long read.";

        $positions = [
            'Marketing' => [
                [
                    'title' => 'Social Media Marketing Strategy',
                    'description' => 'Master the art of social media engagement and growth.',
                    'tags' => ['marketing', 'design'],
                    'lessons' => [
                        ['title' => 'Introduction to Social Media', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration' => 600],
                        ['title' => 'Deep Dive: Psychology of Social Media', 'content_type' => 'article', 'content' => $longMarkdown, 'duration' => 1500],
                        ['title' => 'Platform Specific Strategies', 'content_type' => 'article', 'content' => "## Platform Choice\n\nDetailed breakdown of platform demographics.", 'duration' => 900],
                        ['title' => 'Analytics and Reporting', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration' => 1200],
                        ['title' => 'Case Study: Viral Campaigns', 'content_type' => 'article', 'content' => "## Viral Case Studies\n\nAnalysis of successful marketing campaigns.", 'duration' => 1000],
                    ]
                ],
                [
                    'title' => 'Content Marketing Mastery',
                    'description' => 'Create content that converts and builds brand loyalty.',
                    'tags' => ['marketing', 'management'],
                    'lessons' => [
                        ['title' => 'Content Funnels', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration' => 700],
                        ['title' => 'Strategic Copywriting', 'content_type' => 'article', 'content' => $longMarkdown, 'duration' => 2000],
                        ['title' => 'Storytelling in Business', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration' => 850],
                    ]
                ],
                [
                    'title' => 'SEO Fundamentals',
                    'description' => 'Rank your website on the first page of search results.',
                    'tags' => ['seo', 'marketing'],
                    'lessons' => [
                        ['title' => 'Keyword Research', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration' => 800],
                        ['title' => 'Technical SEO Audit', 'content_type' => 'article', 'content' => $longMarkdown, 'duration' => 1800],
                    ]
                ],
                [
                    'title' => 'Google Ads Specialist',
                    'description' => 'Drive targeted traffic with paid search advertising.',
                    'tags' => ['marketing', 'seo'],
                    'lessons' => [
                        ['title' => 'Ad Copywriting', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration' => 650],
                        ['title' => 'Bidding Strategies', 'content_type' => 'article', 'content' => $longMarkdown, 'duration' => 1200],
                    ]
                ],
                [
                    'title' => 'Brand Identity & Design',
                    'description' => 'Build a memorable brand that stands out.',
                    'tags' => ['design', 'marketing'],
                    'lessons' => [
                        ['title' => 'Visual Storytelling', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration' => 500],
                        ['title' => 'Typography in Branding', 'content_type' => 'article', 'content' => $longMarkdown, 'duration' => 900],
                    ]
                ],
            ],
            'Admin' => [
                [
                    'title' => 'Office Management Essentials',
                    'description' => 'Efficiency and organization in a modern office environment.',
                    'tags' => ['management', 'office'],
                    'lessons' => [
                        ['title' => 'Daily Operations', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration' => 550],
                        ['title' => 'Policy Management', 'content_type' => 'article', 'content' => $longMarkdown, 'duration' => 1100],
                        ['title' => 'Conflict Resolution', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration' => 700],
                    ]
                ],
                [
                    'title' => 'Advanced Data Entry with Excel',
                    'description' => 'Master Excel for business reporting and data management.',
                    'tags' => ['office', 'management'],
                    'lessons' => [
                        ['title' => 'Pivot Tables', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration' => 1200],
                        ['title' => 'Complexity in Spreadsheets', 'content_type' => 'article', 'content' => $longMarkdown, 'duration' => 2500],
                    ]
                ],
                [
                    'title' => 'Professional Business Communication',
                    'description' => 'Communicate effectively in a corporate setting.',
                    'tags' => ['management', 'office'],
                    'lessons' => [
                        ['title' => 'Email Etiquette', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration' => 450],
                        ['title' => 'Negotiation Skills', 'content_type' => 'article', 'content' => $longMarkdown, 'duration' => 1300],
                    ]
                ],
                [
                    'title' => 'Record Keeping & Filing Systems',
                    'description' => 'Organize data and documents for easy retrieval.',
                    'tags' => ['office', 'management'],
                    'lessons' => [
                        ['title' => 'Digital Archiving', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration' => 750],
                        ['title' => 'Information Governance', 'content_type' => 'article', 'content' => $longMarkdown, 'duration' => 1600],
                    ]
                ],
                [
                    'title' => 'Human Resources Fundamentals',
                    'description' => 'Understand the basics of HR and team management.',
                    'tags' => ['management', 'office'],
                    'lessons' => [
                        ['title' => 'Recruitment Process', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration' => 900],
                        ['title' => 'Employee Retention Strategies', 'content_type' => 'article', 'content' => $longMarkdown, 'duration' => 1400],
                    ]
                ],
            ],
            'Programmer' => [
                [
                    'title' => 'Fullstack Development with Laravel & React',
                    'description' => 'Build modern web applications from start to finish.',
                    'tags' => ['development', 'design'],
                    'lessons' => [
                        ['title' => 'Backend Architecture', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration' => 1500],
                        ['title' => 'Advanced Eloquent Relationships', 'content_type' => 'article', 'content' => $longMarkdown, 'duration' => 2000],
                        ['title' => 'Frontend State Management', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration' => 1300],
                        ['title' => 'Testing with Pest & Vitest', 'content_type' => 'article', 'content' => $longMarkdown, 'duration' => 1800],
                    ]
                ],
                [
                    'title' => 'Advanced TypeScript Patterns',
                    'description' => 'Write cleaner and safer code with advanced types.',
                    'tags' => ['development'],
                    'lessons' => [
                        ['title' => 'Generics and Utility Types', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration' => 1100],
                        ['title' => 'Conditional Types Deep Dive', 'content_type' => 'article', 'content' => $longMarkdown, 'duration' => 1900],
                    ]
                ],
                [
                    'title' => 'Database Optimization & SQL',
                    'description' => 'Learn to write efficient queries and design scalable databases.',
                    'tags' => ['development', 'management'],
                    'lessons' => [
                        ['title' => 'Indexing Strategies', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration' => 1300],
                        ['title' => 'Query Optimization Workshop', 'content_type' => 'article', 'content' => $longMarkdown, 'duration' => 2200],
                    ]
                ],
                [
                    'title' => 'Docker for Developers',
                    'description' => 'Containerize your applications for consistent environments.',
                    'tags' => ['development', 'office'],
                    'lessons' => [
                        ['title' => 'Dockerfile Best Practices', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration' => 950],
                        ['title' => 'Multi-container Orchestration', 'content_type' => 'article', 'content' => $longMarkdown, 'duration' => 1700],
                    ]
                ],
                [
                    'title' => 'Microservices Architecture',
                    'description' => 'Design and implement distributed systems.',
                    'tags' => ['development', 'management'],
                    'lessons' => [
                        ['title' => 'Service Communication', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration' => 1400],
                        ['title' => 'Event Driven Design Systems', 'content_type' => 'article', 'content' => $longMarkdown, 'duration' => 2100],
                    ]
                ],
            ],
        ];

        foreach ($positions as $positionName => $courses) {
            $position = Position::updateOrCreate(
                ['name' => $positionName],
                ['description' => "Courses assigned to $positionName position."]
            );

            foreach ($courses as $courseData) {
                $course = Course::updateOrCreate(
                    ['slug' => Str::slug($courseData['title'])],
                    [
                        'instructor_id' => $instructor->id,
                        'title' => $courseData['title'],
                        'description' => $courseData['description'],
                        'is_published' => true,
                    ]
                );

                // Sync Position
                if (!$course->positions()->where('position_id', $position->id)->exists()) {
                    $course->positions()->attach($position->id);
                }

                // Sync Tags
                $tagIds = Tag::whereIn('slug', $courseData['tags'])->pluck('id');
                $course->tags()->syncWithoutDetaching($tagIds);

                // Create Lessons
                foreach ($courseData['lessons'] as $index => $lessonData) {
                    Lesson::updateOrCreate(
                        [
                            'course_id' => $course->id,
                            'title' => $lessonData['title']
                        ],
                        array_merge($lessonData, ['order' => $index + 1, 'is_published' => true])
                    );
                }
            }
        }
    }
}
