import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export default function SortableLessonItem({
    id,
    children,
    isLocked = false,
}: {
    id: string;
    children: React.ReactNode;
    isLocked?: boolean;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id, disabled: isLocked });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        willChange: 'transform',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            // className={`rounded-md border bg-background p-4 ${
            //     isDragging ? 'opacity-80 shadow-lg' : ''
            // } ${isLocked ? 'bg-muted/50 opacity-60' : ''}`}
            className="rounded-md border bg-background p-4 opacity-80 shadow-lg"
        >
            <div className="flex items-center gap-4">
                {/* HANDLE */}
                <button
                    {...attributes}
                    {...listeners}
                    className={`text-muted-foreground hover:text-foreground ${
                        isLocked
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-grab'
                    }`}
                    disabled={isLocked}
                >
                    <GripVertical className="h-5 w-5" />
                </button>
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
}
