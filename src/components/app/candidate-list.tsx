'use client';
import type { Candidate } from "@/lib/types";
import { Button } from "../ui/button";
import { ThumbsUp, ThumbsDown, Edit, Bot } from "lucide-react";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";

interface CandidateListProps {
    candidates: Candidate[];
}

export function CandidateList({ candidates }: CandidateListProps) {
    const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);

    const handleApprove = (candidateId: string) => {
        // TODO: Call firebase function
        alert(`Approving candidate ${candidateId}`);
    }

    const handleReject = (candidateId: string) => {
        // TODO: Call firebase function
        alert(`Rejecting candidate ${candidateId}`);
    }

    const handleEdit = (candidate: Candidate) => {
        setEditingCandidate(candidate);
    }
    
    const handleSaveEdit = () => {
        if (!editingCandidate) return;
        // TODO: Call firebase function to save changes and post
        alert(`Saving and posting edited candidate ${editingCandidate.id}`);
        setEditingCandidate(null);
    }

    if (!candidates || candidates.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <Bot className="mx-auto h-12 w-12 mb-4" />
                <p>No candidates generated for this post yet.</p>
                <Button variant="outline" className="mt-4">Generate Candidates</Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {candidates.map((candidate, index) => (
                <div key={candidate.id} className="p-4 border rounded-lg space-y-3 bg-muted/50">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm">{candidate.text}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <span>Tone: <Badge variant="outline">{candidate.tone}</Badge></span>
                                <span>Emojis: {candidate.emojis.join(' ')}</span>
                                <span>Safety: <Badge variant="outline">{candidate.safetyScore.toFixed(2)}</Badge></span>
                            </div>
                        </div>
                         {index === 0 && <Badge>Best Match</Badge>}
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="bg-green-100 hover:bg-green-200 text-green-800 border-green-200" onClick={() => handleApprove(candidate.id)}>
                            <ThumbsUp className="h-4 w-4 mr-2" /> Approve & Post
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(candidate)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleReject(candidate.id)}>
                            <ThumbsDown className="h-4 w-4 mr-2" /> Reject
                        </Button>
                    </div>
                </div>
            ))}
            
            <Dialog open={!!editingCandidate} onOpenChange={() => setEditingCandidate(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Candidate</DialogTitle>
                    </DialogHeader>
                    {editingCandidate && (
                        <>
                            <Textarea
                                value={editingCandidate.text}
                                onChange={(e) => setEditingCandidate({ ...editingCandidate, text: e.target.value })}
                                className="min-h-[120px]"
                            />
                            <div className="text-right text-sm text-muted-foreground">
                                {editingCandidate.text.length} / 280
                            </div>
                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setEditingCandidate(null)}>Cancel</Button>
                                <Button onClick={handleSaveEdit}>Save & Post</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
