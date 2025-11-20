import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Post } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, Flame, Shield } from "lucide-react";
import Link from "next/link";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const getRiskColor = (score: number) => {
    if (score > 0.5) return "bg-red-500 text-white";
    if (score > 0.2) return "bg-yellow-400 text-black";
    return "bg-green-500 text-white";
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
            <Avatar>
                <AvatarImage src={post.author.avatarUrl} alt={post.author.displayName} />
                <AvatarFallback>{post.author.displayName?.[0]}</AvatarFallback>
            </Avatar>
            <div>
                <div className="font-semibold">{post.author.displayName}</div>
                <div className="text-sm text-muted-foreground">@{post.authorHandle}</div>
            </div>
            </div>
             <Link href={`/queue/${post.id}`}>
                <Button variant="ghost" size="icon">
                    <ArrowUpRight className="h-4 w-4" />
                </Button>
            </Link>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-foreground line-clamp-4">{post.text}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
         <div className="text-xs text-muted-foreground">
            {formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true })}
        </div>
        <div className="flex items-center justify-between w-full">
            <div className="flex gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-orange-500"/> {post.priorityScore}
                </Badge>
                <Badge variant="outline" className={`flex items-center gap-1 ${getRiskColor(post.riskScore || 0)} border-0`}>
                    <Shield className="h-3 w-3"/> {post.riskScore}
                </Badge>
            </div>
             <Badge variant={post.status === 'queued' ? 'default' : 'secondary'} className="capitalize">{post.status}</Badge>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
            {post.topicTags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
        </div>
      </CardFooter>
    </Card>
  );
}

PostCard.Skeleton = function PostCardSkeleton() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[120px]" />
                        <Skeleton className="h-3 w-[80px]" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
                 <Skeleton className="h-3 w-[100px]" />
                 <div className="flex items-center justify-between w-full">
                    <div className="flex gap-2">
                       <Skeleton className="h-6 w-12 rounded-full" />
                       <Skeleton className="h-6 w-12 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
            </CardFooter>
        </Card>
    )
}
