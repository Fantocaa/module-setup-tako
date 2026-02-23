import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Permission {
    id: number;
    name: string;
    group?: string | null;
    guard_name?: string;
    created_at?: string;
    updated_at?: string;
}

export type Transaction = {
    id: number;
    description: string;
    amount: number;
    type: string;
    created_at: string;
};

interface PermissionFormProps {
    permission?: {
        id: number;
        name: string;
        group: string | null;
    };
    groups?: string[];
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
    color?: string | null;
}

export interface Course {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    thumbnail: string | null;
    is_published: boolean;
    instructor?: User;
    tags?: Tag[];
    lessons?: Lesson[];
    lesson_count?: number;
    total_duration?: number;
    created_at: string;
    updated_at: string;
}

export interface Lesson {
    id: number;
    course_id: number;
    title: string;
    content_type: 'video' | 'article';
    video_url: string | null;
    video_path: string | null;
    content: string | null;
    duration: number | null;
    order: number;
    is_published: boolean;
    is_preview: boolean;
    created_at: string;
    updated_at: string;
}
