import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
    file: string;
    title: string;
}

export default function PdfViewer({ file, title }: PdfViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.2);
    const [pdfFile, setPdfFile] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let objectUrl: string | null = null;

        async function loadPdf() {
            try {
                setIsLoading(true);
                const response = await fetch(file);
                const json = await response.json();

                // Decode base64 to binary
                const binaryString = window.atob(json.data);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                const blob = new Blob([bytes], { type: 'application/pdf' });
                objectUrl = URL.createObjectURL(blob);
                setPdfFile(objectUrl);
            } catch (error) {
                console.error('Failed to load protected PDF:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadPdf();

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [file]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    return (
        <div
            className="group relative flex min-h-[400px] flex-col items-center gap-4 rounded-2xl border border-white/5 bg-[#1a1a1a] px-4 py-8"
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* Download protection overlay */}
            <div className="pointer-events-none absolute inset-0 z-10 select-none" />

            {!isLoading && (
                <div className="sticky top-4 z-20 mb-4 flex w-full max-w-4xl items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-2 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <button
                            disabled={pageNumber <= 1}
                            onClick={() => setPageNumber((prev) => prev - 1)}
                            className="rounded-lg p-2 transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <span className="text-sm font-bold tabular-nums">
                            Page {pageNumber} of {numPages}
                        </span>
                        <button
                            disabled={pageNumber >= numPages}
                            onClick={() => setPageNumber((prev) => prev + 1)}
                            className="rounded-lg p-2 transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                setScale((prev) => Math.max(0.5, prev - 0.2))
                            }
                            className="rounded-lg p-2 transition-all hover:bg-white/10"
                            title="Zoom Out"
                        >
                            <span className="text-xl font-bold">-</span>
                        </button>
                        <span className="w-12 text-center text-xs font-bold">
                            {Math.round(scale * 100)}%
                        </span>
                        <button
                            onClick={() =>
                                setScale((prev) => Math.min(2.5, prev + 0.2))
                            }
                            className="rounded-lg p-2 transition-all hover:bg-white/10"
                            title="Zoom In"
                        >
                            <span className="text-xl font-bold">+</span>
                        </button>
                    </div>
                </div>
            )}

            <div
                className="custom-scrollbar flex w-full justify-center overflow-auto"
                ref={containerRef}
            >
                {pdfFile ? (
                    <Document
                        file={pdfFile}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div className="flex items-center justify-center p-20">
                                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
                            </div>
                        }
                        className="flex justify-center"
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                            className="overflow-hidden rounded-sm border border-white/10 shadow-2xl"
                        />
                    </Document>
                ) : (
                    <div className="flex items-center justify-center p-20">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
                    </div>
                )}
            </div>

            {/* Custom overlay to prevent easy selection/dragging of canvas */}
            <div className="pointer-events-none absolute inset-x-0 top-24 bottom-0 z-10" />
        </div>
    );
}
