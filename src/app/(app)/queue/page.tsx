'use client';

import { PostCard } from "@/components/app/post-card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockPosts } from "@/lib/mock-data";
import { ListFilter } from "lucide-react";
import { useState } from "react";
import type { Post } from "@/lib/types";

// TODO: Replace with useRealtimeQueue hook
const useRealtimeQueue = () => {
    const [posts, setPosts] = useState<Post[]>(mockPosts);
    const loading = false;
    return { posts, loading };
}

export default function QueuePage() {
  const { posts, loading } = useRealtimeQueue();
  const [filters, setFilters] = useState({
    topic: 'all',
    recency: 'newest',
    risk: 'all'
  });

  // TODO: Implement filtering logic based on state
  const filteredPosts = posts;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline">Live Queue</h1>
        <div className="flex items-center gap-2">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Recency</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Priority Score</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Risk Score</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* TODO: Implement infinite scroll */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
            Array.from({ length: 8 }).map((_, i) => <PostCard.Skeleton key={i} />)
        ) : (
            filteredPosts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </div>
      <div className="flex justify-center mt-8">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  );
}
