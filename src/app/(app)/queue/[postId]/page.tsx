'use client';
import { Post, Candidate, AuditLog } from "@/lib/types";
import { mockPosts, mockCandidates, mockAuditLogs } from "@/lib/mock-data";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ArrowLeft, Edit, Send, ThumbsDown, ThumbsUp } from "lucide-react";
import { CandidateList } from "@/components/app/candidate-list";
import { SafetyPanel } from "@/components/app/safety-panel";
import { AuditTrail } from "@/components/app/audit-trail";
import { useEffect, useState } from "react";

// TODO: Replace with SWR fetch
const usePostDetails = (postId: string | null) => {
    const [post, setPost] = useState<Post | null>(null);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (postId) {
            setLoading(true);
            // Simulate fetching data
            setTimeout(() => {
                const foundPost = mockPosts.find(p => p.id === postId) || null;
                setPost(foundPost);
                setCandidates(mockCandidates[postId as keyof typeof mockCandidates] || []);
                setAuditLogs(mockAuditLogs.filter(log => log.details.postId === postId));
                setLoading(false);
            }, 500);
        }
    }, [postId]);

    return { post, candidates, auditLogs, loading };
}


export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.postId as string;
  const { post, candidates, auditLogs, loading } = usePostDetails(postId);
  
  if (loading) {
      return <div>Loading...</div>; // TODO: Add skeleton loader
  }

  if (!post) {
    return <div>Post not found.</div>;
  }
  
  const handleAutoApprove = () => {
    // TODO: Call Firebase function
    alert(`Auto-approving best candidate for post ${post.id}`);
  };

  const handleEditAndPost = () => {
    // TODO: Open composer with selected candidate
    router.push(`/composer?candidateId=${candidates[0].id}`);
  };

  const handleRejectAll = () => {
    // TODO: Call Firebase function
    alert(`Rejecting all candidates for post ${post.id}`);
  };

  const handleSendToManual = () => {
    // TODO: Call Firebase function and update post status
    alert(`Sending post ${post.id} to manual queue`);
  };

  return (
    <div className="space-y-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Queue
        </Button>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
           {/* Original Post */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={post.author.avatarUrl} alt={post.author.displayName} />
                  <AvatarFallback>{post.author.displayName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{post.author.displayName}</div>
                  <div className="text-sm text-muted-foreground">@{post.authorHandle}</div>
                </div>
                <div className="text-sm text-muted-foreground ml-auto">
                  {format(post.createdAt.toDate(), "MMM d, yyyy 'at' h:mm a")}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{post.text}</p>
               <div className="flex flex-wrap gap-2 mt-4">
                    {post.topicTags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
            </CardContent>
          </Card>

           {/* Candidates */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Candidates</CardTitle>
              <CardDescription>Review, approve, or edit the AI-generated replies.</CardDescription>
            </CardHeader>
            <CardContent>
              <CandidateList candidates={candidates} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
            {/* Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                    <Button onClick={handleAutoApprove}><ThumbsUp className="mr-2 h-4 w-4" /> Auto-Approve Best</Button>
                    <Button variant="secondary" onClick={handleEditAndPost}><Edit className="mr-2 h-4 w-4" /> Edit & Post</Button>
                    <Button variant="secondary" onClick={handleRejectAll}><ThumbsDown className="mr-2 h-4 w-4" /> Reject All</Button>
                    <Button variant="outline" onClick={handleSendToManual}><Send className="mr-2 h-4 w-4" /> Send to Manual</Button>
                </CardContent>
            </Card>

            {/* Safety */}
            <SafetyPanel safetyChecks={candidates[0]?.safetyChecks} riskScore={post.riskScore} />

            {/* Audit Trail */}
            <AuditTrail logs={auditLogs} />
        </div>
      </div>
    </div>
  );
}
