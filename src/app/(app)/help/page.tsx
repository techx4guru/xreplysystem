'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, PauseCircle, PlayCircle, ShieldAlert } from "lucide-react";

export default function HelpPage() {
    const handlePause = () => {
        // TODO: call pauseSystem function
        alert("System pause requested.");
    };

    const handleForcePause = () => {
        // TODO: call forcePause function
        if(confirm("Are you sure you want to force pause? This will stop all in-flight operations immediately.")) {
            alert("System force pause initiated.");
        }
    };
    
    const handleResume = () => {
        // TODO: call resumeSystem function
        alert("System resume requested.");
    };

    const handleEscalate = () => {
        // TODO: call escalateToOps function (e.g., via PagerDuty webhook)
        alert("Escalation to Ops team has been triggered.");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Help & Runbook</h1>
                <p className="text-muted-foreground">Quick actions and standard operating procedures for emergencies.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Emergency Actions</CardTitle>
                    <CardDescription>Use these controls to manage the system state during an incident.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button onClick={handleResume} className="bg-green-600 hover:bg-green-700">
                        <PlayCircle className="mr-2 h-4 w-4"/> Resume System
                    </Button>
                    <Button onClick={handlePause} variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                        <PauseCircle className="mr-2 h-4 w-4"/> Pause System
                    </Button>
                     <Button onClick={handleForcePause} variant="destructive">
                        <PauseCircle className="mr-2 h-4 w-4"/> Force Pause
                    </Button>
                    <Button onClick={handleEscalate} variant="outline">
                        <ShieldAlert className="mr-2 h-4 w-4"/> Escalate to Ops
                    </Button>
                </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>When to Pause</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p>You should pause the system if you notice:</p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>A high volume of inappropriate or off-topic replies being posted.</li>
                            <li>The AI is responding to sensitive or controversial topics incorrectly.</li>
                            <li>X API rate limits are being hit unexpectedly.</li>
                            <li>A significant change in brand voice or tone.</li>
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Escalation Procedure</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p>Escalate to the Ops team if:</p>
                         <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Pausing the system does not resolve the issue.</li>
                            <li>A critical security vulnerability is suspected.</li>
                            <li>The system is unresponsive or posting uncontrollably.</li>
                            <li>There is a major PR incident involving an automated reply.</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
