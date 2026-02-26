import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface PapiRole {
    code: string;
    aspect_id: number;
    name: string;
    name_id: string;
    description: string;
    score: number;
    category: 'Lower' | 'Middle' | 'Higher';
    label: string;
    interpretation: string;
}

export interface PapiAspect {
    aspect_id: number;
    name: string;
    roles: PapiRole[];
}

export interface PapiAnalysis {
    tally: Record<number, number>;
    roles: PapiRole[];
    aspects: PapiAspect[];
    dominant_roles: string[];
    summary: string;
}

interface Props {
    analysis: PapiAnalysis;
}

export function PapiCosticResultDisplay({ analysis }: Props) {
    return (
        <div className="space-y-6">
            {/* Summary Card */}
            <Card className="border-violet-100 bg-violet-50/30">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold tracking-wider text-violet-800 uppercase">
                        Ringkasan Profil
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-base leading-relaxed font-medium text-violet-900">
                        {analysis.summary}
                    </p>
                    {analysis.dominant_roles.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {analysis.dominant_roles.map((role) => (
                                <Badge
                                    key={role}
                                    variant="outline"
                                    className="border-violet-200 bg-violet-100 text-violet-700"
                                >
                                    {role}
                                </Badge>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Aspects Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {analysis.aspects.map((aspect) => (
                    <Card
                        key={aspect.aspect_id}
                        className="overflow-hidden border-border bg-card shadow-sm"
                    >
                        <CardHeader className="bg-muted/30 py-4">
                            <CardTitle className="text-sm font-black tracking-widest text-foreground uppercase">
                                {aspect.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 p-5">
                            {aspect.roles.map((role) => (
                                <div key={role.code} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="flex h-6 w-6 items-center justify-center rounded bg-violet-600 text-[10px] font-black text-white">
                                                {role.code}
                                            </span>
                                            <span className="text-sm font-bold text-foreground">
                                                {role.name_id}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-[10px] font-black tracking-tighter uppercase ${
                                                    role.category === 'Higher'
                                                        ? 'text-violet-600'
                                                        : role.category ===
                                                            'Middle'
                                                          ? 'text-amber-600'
                                                          : 'text-slate-400'
                                                }`}
                                            >
                                                {role.label}
                                            </span>
                                            <span className="text-sm font-black text-foreground">
                                                {role.score}/9
                                            </span>
                                        </div>
                                    </div>
                                    <div className="relative pt-1">
                                        <div className="flex h-2 overflow-hidden rounded-full bg-muted text-xs">
                                            <div
                                                style={{
                                                    width: `${(role.score / 9) * 100}%`,
                                                }}
                                                className={`flex flex-col justify-center text-center whitespace-nowrap text-white shadow-none transition-all duration-500 ${
                                                    role.category === 'Higher'
                                                        ? 'bg-violet-600'
                                                        : role.category ===
                                                            'Middle'
                                                          ? 'bg-amber-500'
                                                          : 'bg-slate-300'
                                                }`}
                                            ></div>
                                        </div>
                                        {/* Markers for 0-9 */}
                                        <div className="mt-1 flex justify-between px-0.5">
                                            {[...Array(10)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 w-px ${i % 3 === 0 ? 'bg-muted-foreground/40' : 'bg-muted-foreground/20'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-[11px] leading-snug text-muted-foreground italic">
                                        {role.interpretation}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
