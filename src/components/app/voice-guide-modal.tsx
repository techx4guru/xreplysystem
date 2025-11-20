'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { BookOpen } from "lucide-react";
import { Badge } from "../ui/badge";

export function VoiceGuideModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
            <BookOpen className="mr-2 h-4 w-4"/>
            Voice Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">The Autopilot Voice Model</DialogTitle>
          <DialogDescription>
            Our AI follows the GT Alternative-1 voice model to create sharp, engaging replies.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
            <div className="p-4 border-l-4 border-primary bg-primary/10 rounded-r-lg">
                <h3 className="font-semibold text-lg font-headline">Core Structure</h3>
                <p className="text-2xl font-semibold mt-2">
                    <span className="text-primary">Hook</span> → <span className="text-accent">Context</span> → <span className="text-yellow-600">Question</span> → <span className="text-purple-600">Emoji</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                    Every reply should follow this four-part structure to maximize engagement and clarity.
                </p>
            </div>
            
            <div className="space-y-4">
                <h3 className="font-semibold text-lg font-headline">Example Prompts</h3>
                <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Inquisitive Question</h4>
                        <Badge variant="outline">Tone: Inquisitive</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground font-mono">
                        <span className="text-primary">Hook:</span> Start with agreement or an interesting observation.<br/>
                        <span className="text-accent">Context:</span> Briefly add your perspective.<br/>
                        <span className="text-yellow-600">Question:</span> Ask a probing, open-ended question.<br/>
                        <span className="text-purple-600">Emoji:</span> Add a single, thoughtful emoji.
                    </p>
                    <p className="mt-3 text-sm border-t pt-3">
                        <span className="font-semibold">Example Output:</span> "Great point! That also ties into X. What are your thoughts on Y? 🤔"
                    </p>
                </div>
                 <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Optimistic Challenge</h4>
                        <Badge variant="outline">Tone: Optimistic</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground font-mono">
                        <span className="text-primary">Hook:</span> Express excitement about the topic.<br/>
                        <span className="text-accent">Context:</span> State a potential positive outcome.<br/>
                        <span className="text-yellow-600">Question:</span> Challenge the author or audience to think bigger.<br/>
                        <span className="text-purple-600">Emoji:</span> Add an inspiring emoji.
                    </p>
                     <p className="mt-3 text-sm border-t pt-3">
                        <span className="font-semibold">Example Output:</span> "This is huge! Imagine the possibilities for Z. What if we could take it a step further and do A? 🚀"
                    </p>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
