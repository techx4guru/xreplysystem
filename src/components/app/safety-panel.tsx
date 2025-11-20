import type { SafetyCheckResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface SafetyPanelProps {
    safetyChecks?: SafetyCheckResult;
    riskScore?: number;
}

const SafetyMeter = ({ label, value }: { label: string; value: number }) => {
    const getColor = () => {
        if (value > 0.7) return 'bg-red-500';
        if (value > 0.3) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium capitalize">{label}</span>
                <span className="text-sm text-muted-foreground">{(value * 100).toFixed(0)}%</span>
            </div>
            <Progress value={value * 100} indicatorClassName={getColor()} />
        </div>
    );
};

export function SafetyPanel({ safetyChecks, riskScore = 0 }: SafetyPanelProps) {
    
    const getOverallRisk = () => {
        if (riskScore > 0.7) return { text: "High Risk", icon: ShieldAlert, color: "text-red-500" };
        if (riskScore > 0.3) return { text: "Medium Risk", icon: ShieldAlert, color: "text-yellow-500" };
        return { text: "Low Risk", icon: ShieldCheck, color: "text-green-500" };
    };

    const overallRisk = getOverallRisk();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" /> Safety & Risk Analysis
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-3 rounded-lg border flex items-center gap-3">
                    <overallRisk.icon className={`h-8 w-8 ${overallRisk.color}`} />
                    <div>
                        <div className="font-semibold">Overall Risk Score: {riskScore.toFixed(2)}</div>
                        <div className={`text-sm ${overallRisk.color}`}>{overallRisk.text}</div>
                    </div>
                </div>
                {safetyChecks ? (
                    <div className="space-y-4">
                        <SafetyMeter label="Toxicity" value={safetyChecks.toxicity} />
                        <SafetyMeter label="Political" value={safetyChecks.political} />
                        <SafetyMeter label="Medical" value={safetyChecks.medical} />
                        <SafetyMeter label="Doxxing" value={safetyChecks.doxx} />
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-4">
                        <p>No detailed safety checks available.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
