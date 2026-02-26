import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

export interface DiscTally {
    D: number;
    I: number;
    S: number;
    C: number;
    N: number;
}

export interface DiscGraph {
    d: number;
    i: number;
    s: number;
    c: number;
}

export interface DiscLineResult {
    label: string;
    pattern_id: number;
    type: string;
    pattern: string;
    behaviour: string[];
    description: string;
    jobs: string[];
}

export interface DiscAnalysis {
    tally: {
        line1: DiscTally;
        line2: DiscTally;
        line3: DiscTally;
    };
    graphs: {
        line1: DiscGraph;
        line2: DiscGraph;
        line3: DiscGraph;
    };
    results: {
        line1: DiscLineResult;
        line2: DiscLineResult;
        line3: DiscLineResult;
    };
}

const chartConfig = {
    line1: {
        label: 'Graph I (Most)',
        color: '#3b82f6', // blue-500
    },
    line2: {
        label: 'Graph II (Least)',
        color: '#94a3b8', // slate-400
    },
    line3: {
        label: 'Graph III (Change)',
        color: '#22c55e', // green-500
    },
} satisfies ChartConfig;

export function DiscResultDisplay({ analysis }: { analysis: DiscAnalysis }) {
    const chartData = [
        {
            dimension: 'D',
            line1: analysis.graphs.line1.d,
            line2: analysis.graphs.line2.d,
            line3: analysis.graphs.line3.d,
        },
        {
            dimension: 'I',
            line1: analysis.graphs.line1.i,
            line2: analysis.graphs.line2.i,
            line3: analysis.graphs.line3.i,
        },
        {
            dimension: 'S',
            line1: analysis.graphs.line1.s,
            line2: analysis.graphs.line2.s,
            line3: analysis.graphs.line3.s,
        },
        {
            dimension: 'C',
            line1: analysis.graphs.line1.c,
            line2: analysis.graphs.line2.c,
            line3: analysis.graphs.line3.c,
        },
    ];

    return (
        <div className="space-y-8">
            <Card className="border-none shadow-none">
                <CardHeader className="rounded-t-lg border-none bg-indigo-900 px-6 py-4">
                    <CardTitle className="text-xl font-bold tracking-wider text-white uppercase">
                        Ikhtisar Interpretasi
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pt-6">
                    <p className="mb-8 px-6 text-sm leading-relaxed text-gray-600">
                        Berikut adalah ringkasan yang menunjukkan bagaimana
                        laporan pribadi Anda dihasilkan. Grafik III adalah hasil
                        dan menggabungkan pilihan "Paling" dengan pilihan
                        "Paling Tidak" diri Anda dan digunakan untuk menentukan
                        dimensi DISC tertinggi, skor Indeks Intensitas, dan Pola
                        Profil Klasik Anda.
                    </p>

                    <div className="grid grid-cols-1 items-start gap-8 px-6 lg:grid-cols-12">
                        {/* TALLY BOX */}
                        <div className="overflow-x-auto lg:col-span-4">
                            <p className="mb-4 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                TALLY BOX
                            </p>
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="py-2 text-left font-semibold text-gray-500">
                                            Dimensi
                                        </th>
                                        <th className="py-2 text-center font-semibold text-gray-500">
                                            Graph I Most
                                        </th>
                                        <th className="py-2 text-center font-semibold text-gray-500">
                                            Graph II Least
                                        </th>
                                        <th className="py-2 text-center font-semibold text-gray-500">
                                            Graph III Change
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {(['D', 'I', 'S', 'C', 'N'] as const).map(
                                        (dim) => (
                                            <tr
                                                key={dim}
                                                className="transition-colors hover:bg-gray-50/50"
                                            >
                                                <td className="py-3 font-bold text-gray-700">
                                                    {dim}
                                                </td>
                                                <td className="py-3 text-center text-gray-600">
                                                    {analysis.tally.line1[dim]}
                                                </td>
                                                <td className="py-3 text-center text-gray-600">
                                                    {analysis.tally.line2[dim]}
                                                </td>
                                                <td className="py-3 text-center text-gray-600">
                                                    {analysis.tally.line3[dim]}
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>

                            <div className="mt-6 space-y-1">
                                <p className="mb-2 text-[10px] font-bold tracking-widest text-indigo-600/60 uppercase">
                                    SCORE SUMMARY
                                </p>
                                <p className="text-xs font-medium text-blue-600">
                                    MOST Mask Public Self:{' '}
                                    {analysis.graphs.line1.d.toFixed(1)}
                                </p>
                                <p className="text-xs font-medium text-slate-500">
                                    LEAST Core Private Self:{' '}
                                    {analysis.graphs.line2.d.toFixed(1)}
                                </p>
                                <p className="text-xs font-medium text-green-600">
                                    CHANGE Mirror Perceived Self:{' '}
                                    {analysis.graphs.line3.d.toFixed(1)}
                                </p>
                            </div>
                        </div>

                        {/* RESULT GRAPH */}
                        <div className="lg:col-span-8">
                            <p className="mb-4 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                Result Graph
                            </p>
                            <ChartContainer
                                config={chartConfig}
                                className="h-64 w-full sm:h-80"
                            >
                                <LineChart
                                    data={chartData}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#e5e7eb"
                                    />
                                    <XAxis
                                        dataKey="dimension"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fill: '#9ca3af',
                                            fontSize: 12,
                                            fontWeight: 700,
                                        }}
                                    />
                                    <YAxis
                                        domain={[-8, 8]}
                                        ticks={[-8, -4, 0, 4, 8]}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    />
                                    <ChartTooltip
                                        content={<ChartTooltipContent />}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="line1"
                                        stroke="var(--color-line1)"
                                        strokeWidth={3}
                                        dot={{
                                            r: 6,
                                            fill: 'var(--color-line1)',
                                            strokeWidth: 0,
                                        }}
                                        activeDot={{ r: 8 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="line2"
                                        stroke="var(--color-line2)"
                                        strokeWidth={3}
                                        dot={{
                                            r: 6,
                                            fill: 'var(--color-line2)',
                                            strokeWidth: 0,
                                        }}
                                        activeDot={{ r: 8 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="line3"
                                        stroke="var(--color-line3)"
                                        strokeWidth={3}
                                        dot={{
                                            r: 6,
                                            fill: 'var(--color-line3)',
                                            strokeWidth: 0,
                                        }}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ChartContainer>
                            <div className="mt-6 flex flex-wrap justify-center gap-6 lg:justify-start">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">
                                        Graph I (Most)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-slate-400" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">
                                        Graph II (Least)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-green-500" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">
                                        Graph III (Change)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* GAMBARAN KARAKTER SECTION */}
            <div className="space-y-6">
                <div className="rounded-lg bg-indigo-900 px-6 py-4 shadow-sm">
                    <h3 className="text-xl font-bold tracking-wider text-white uppercase">
                        Gambaran Karakter
                    </h3>
                </div>

                {/* Section 1: Most */}
                <CharacterSection
                    title="Kepribadian di muka umum"
                    result={analysis.results.line1}
                />

                {/* Section 2: Least */}
                <CharacterSection
                    title="Kepribadian saat mendapat tekanan"
                    result={analysis.results.line2}
                />

                {/* Section 3: Change */}
                <CharacterSection
                    title="Kepribadian asli yang tersembunyi"
                    result={analysis.results.line3}
                />

                {/* Description & Jobs */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                        <div className="bg-indigo-900 px-6 py-3">
                            <h4 className="text-sm font-bold tracking-wider text-white uppercase">
                                Deskripsi Kepribadian
                            </h4>
                        </div>
                        <div className="p-6">
                            <p className="text-sm leading-relaxed text-gray-700">
                                {analysis.results.line3.description}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                        <div className="bg-indigo-900 px-6 py-3">
                            <h4 className="text-sm font-bold tracking-wider text-white uppercase">
                                Pekerjaan Yang Sesuai
                            </h4>
                        </div>
                        <div className="p-6">
                            <ul className="grid grid-cols-2 gap-2">
                                {analysis.results.line3.jobs.map((job, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center gap-2 text-xs text-gray-600"
                                    >
                                        <span className="h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
                                        {job}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CharacterSection({
    title,
    result,
}: {
    title: string;
    result: DiscLineResult;
}) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="bg-indigo-900 px-6 py-3">
                <h4 className="text-sm font-bold tracking-wider text-white uppercase">
                    {title}
                </h4>
            </div>
            <div className="p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-lg font-black tracking-tight text-gray-800 uppercase">
                        {result.pattern}
                    </p>
                    <span className="rounded-full border border-indigo-200 bg-indigo-100 px-3 py-1 text-[10px] font-black tracking-widest text-indigo-700 uppercase">
                        {result.type}
                    </span>
                </div>
                <ul className="space-y-2">
                    {result.behaviour.map((item, idx) => (
                        <li
                            key={idx}
                            className="flex items-center gap-3 text-sm font-medium text-gray-700"
                        >
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
