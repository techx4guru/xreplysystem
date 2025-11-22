
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Calendar, Send } from "lucide-react"

export default function ComposerPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Admin Composer</h1>
                <p className="text-muted-foreground">Manually compose and post a reply from an admin context.</p>
            </div>
            
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>New Reply</CardTitle>
                    <CardDescription>Craft your message, schedule it, or post it immediately.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea 
                        placeholder="What's happening?"
                        className="min-h-[150px] text-lg"
                    />
                    <div className="text-right text-sm text-muted-foreground">
                        0 / 280
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <div className="flex gap-2">
                        <Button variant="outline"><Calendar className="h-4 w-4 mr-2"/> Schedule</Button>
                        <Button variant="outline">😊</Button> 
                    </div>
                    <Button><Send className="h-4 w-4 mr-2"/> Post Now</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
