import { editorTheme } from '@/components/editor/themes/editor-theme';
import { TRANSFORMERS } from '@/components/editor/transformers/markdown-transformers';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
    $convertFromMarkdownString,
    $convertToMarkdownString,
} from '@lexical/markdown';
import {
    InitialConfigType,
    LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, SerializedEditorState } from 'lexical';

import { nodes } from './nodes';
import { Plugins } from './plugins';

const editorConfig: InitialConfigType = {
    namespace: 'Editor',
    theme: editorTheme,
    nodes,
    onError: (error: Error) => {
        console.error(error);
    },
};

export function Editor({
    editorState,
    editorSerializedState,
    markdown,
    onChange,
    onSerializedChange,
    onMarkdownChange,
}: {
    editorState?: EditorState;
    editorSerializedState?: SerializedEditorState;
    markdown?: string;
    onChange?: (editorState: EditorState) => void;
    onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
    onMarkdownChange?: (markdown: string) => void;
}) {
    return (
        <div className="h-72 overflow-hidden rounded-lg border bg-background shadow">
            <LexicalComposer
                initialConfig={{
                    ...editorConfig,
                    ...(editorState ? { editorState } : {}),
                    ...(markdown
                        ? {
                              editorState: () =>
                                  $convertFromMarkdownString(
                                      markdown,
                                      TRANSFORMERS,
                                  ),
                          }
                        : {}),
                    ...(editorSerializedState
                        ? { editorState: JSON.stringify(editorSerializedState) }
                        : {}),
                }}
            >
                <TooltipProvider>
                    <Plugins />

                    <OnChangePlugin
                        ignoreSelectionChange={true}
                        onChange={(editorState) => {
                            onChange?.(editorState);
                            onSerializedChange?.(editorState.toJSON());
                            onMarkdownChange?.(
                                editorState.read(() =>
                                    $convertToMarkdownString(TRANSFORMERS),
                                ),
                            );
                        }}
                    />
                </TooltipProvider>
            </LexicalComposer>
        </div>
    );
}
