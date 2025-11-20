'use client';
import { PromptEditor } from "@/components/app/prompt-editor";
import { VoiceGuideModal } from "@/components/app/voice-guide-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTemplates } from "@/lib/mock-data";
import type { Template } from "@/lib/types";
import { Bot, PlusCircle } from "lucide-react";
import { useState } from "react";

// TODO: Replace with SWR fetch for templates
const useTemplates = () => {
    return { templates: mockTemplates, loading: false };
}

export default function TemplatesPage() {
    const { templates, loading } = useTemplates();
    const [selectedTemplate, setSelectedTemplate] = useState<Template | 'new' | null>(null);

    const handleEdit = (template: Template) => {
        setSelectedTemplate(template);
    };

    const handleCreateNew = () => {
        setSelectedTemplate('new');
    };

    const handleCloseEditor = () => {
        setSelectedTemplate(null);
    }
    
    if (selectedTemplate) {
        return <PromptEditor template={selectedTemplate === 'new' ? undefined : selectedTemplate} onClose={handleCloseEditor} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Prompt Bank</h1>
                    <p className="text-muted-foreground">Manage the AI's voice and response strategies.</p>
                </div>
                <div className="flex items-center gap-2">
                    <VoiceGuideModal />
                    <Button onClick={handleCreateNew}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Template
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {templates.map(template => (
                    <Card key={template.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bot className="w-5 h-5 text-primary" />
                                {template.name}
                            </CardTitle>
                            <CardDescription>
                                Tone: <Badge variant="outline">{template.tone}</Badge>
                                <span className="ml-2">Version: {template.version}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-muted-foreground line-clamp-3">{template.seed}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <div className="flex flex-wrap gap-1">
                                {template.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                            </div>
                            <Button variant="secondary" size="sm" onClick={() => handleEdit(template)}>Edit</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
