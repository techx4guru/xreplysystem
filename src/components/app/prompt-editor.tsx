'use client';
import { useState } from 'react';
import type { Template } from '@/lib/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, Wand2 } from 'lucide-react';

interface PromptEditorProps {
    template?: Template;
    onClose: () => void;
}

const newTemplate: Omit<Template, 'id' | 'createdAt' | 'updatedAt' > = {
    name: '',
    seed: 'Hook: \nContext: \nQuestion: \nEmoji: ',
    tone: '',
    tags: [],
    safetyFlags: [],
    sampleOutputs: [],
    version: 1,
};

export function PromptEditor({ template, onClose }: PromptEditorProps) {
    const [formData, setFormData] = useState(template || newTemplate);
    const [isGenerating, setIsGenerating] = useState(false);
    const [sampleOutput, setSampleOutput] = useState(template?.sampleOutputs[0] || '');

    const handleGenerateSample = async () => {
        setIsGenerating(true);
        // TODO: Call 'generateSampleOutput' Genkit flow
        // For now, simulate a delay and set a mock response
        setTimeout(() => {
            setSampleOutput(`This is a generated sample based on the prompt seed. The AI would elaborate on "${formData.seed.substring(0, 30)}..."`);
            setIsGenerating(false);
        }, 1000);
    };

    const handleSave = () => {
        // TODO: Implement save to Firestore
        alert(`Saving template: ${formData.name}`);
        onClose();
    };

    return (
        <div className="space-y-6">
            <Button variant="outline" size="sm" onClick={onClose}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Templates
            </Button>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{template ? 'Edit Template' : 'Create New Template'}</CardTitle>
                            <CardDescription>Define the structure and tone for AI-generated replies.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Template Name</Label>
                                <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g., Inquisitive Question" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="seed">Seed Prompt</Label>
                                <Textarea id="seed" value={formData.seed} onChange={e => setFormData({...formData, seed: e.target.value})} placeholder="Hook: ..." className="min-h-[200px] font-mono text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tone">Tone</Label>
                                    <Input id="tone" value={formData.tone} onChange={e => setFormData({...formData, tone: e.target.value})} placeholder="e.g., inquisitive, optimistic" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                                    <Input id="tags" value={formData.tags.join(', ')} onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})} placeholder="e.g., engagement, tech" />
                                </div>
                            </div>
                        </CardContent>
                         <CardFooter className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button onClick={handleSave}>Save Template</Button>
                        </CardFooter>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                            <CardDescription>Generate a sample output to test your prompt.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={handleGenerateSample} disabled={isGenerating} className="w-full">
                                <Wand2 className="mr-2 h-4 w-4" />
                                {isGenerating ? 'Generating...' : 'Generate Sample'}
                            </Button>
                            <div className="mt-4 p-4 border rounded-lg min-h-[150px] bg-muted">
                                {isGenerating ? (
                                    <p className="text-muted-foreground animate-pulse">Generating sample output...</p>
                                ) : (
                                    <p className="text-sm text-foreground">{sampleOutput || 'Click generate to see a sample output.'}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
