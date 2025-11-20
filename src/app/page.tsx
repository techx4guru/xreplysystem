import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="M11.767 19.089c4.91 0 7.43-4.141 7.43-7.43 0-1.3-.323-2.52-.89-3.635" />
            <path d="M14.534 9.873a4.136 4.136 0 0 0-4.66-4.66" />
            <path d="M19.199 4.801c-1.115-.568-2.315-.89-3.635-.89-3.289 0-7.43 2.52-7.43 7.43 0 4.91 4.141 7.43 7.43 7.43 1.3 0 2.52-.323 3.635-.89" />
            <path d="M9.873 9.466a4.136 4.136 0 0 1 4.66 4.66" />
            <path d="M4.801 4.801C3.685 5.915 2.5 7.69 2.5 9.873c0 3.289 2.52 7.43 7.43 7.43" />
          </svg>
          <span className="sr-only">X-Reply Autopilot</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Features
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Pricing
          </Link>
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Automate Your X Replies with AI Precision
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    X-Reply Autopilot uses advanced AI to generate, vet, and post replies, so you can focus on what matters.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/login">Start Your Free Trial</Link>
                  </Button>
                </div>
              </div>
              <div className="w-full h-full bg-muted rounded-xl flex items-center justify-center p-8">
                 <img src="https://picsum.photos/seed/hero/600/400" data-ai-hint="abstract tech" alt="Hero" className="rounded-lg shadow-2xl" />
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">The Ultimate Reply Automation Toolkit</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From intelligent candidate generation to comprehensive safety checks, we have everything you need to manage your brand's presence effortlessly.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <FeatureCard title="Live Post Queue" description="Monitor incoming posts in real-time. Prioritize and filter with our intelligent scoring system." />
              <FeatureCard title="AI Candidate Generation" description="Generate multiple high-quality reply candidates for each post using fine-tuned AI models." />
              <FeatureCard title="Advanced Safety Checks" description="Automatically screen all replies for toxicity, political content, and other risks." />
              <FeatureCard title="Prompt Template Editor" description="Fine-tune your AI's voice and tone with a powerful yet simple prompt editor." />
              <FeatureCard title="In-depth Analytics" description="Track engagement, reply performance, and safety metrics with our beautiful dashboards." />
              <FeatureCard title="Full Audit Trail" description="Maintain a complete log of all actions, from generation to posting, for compliance and review." />
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Transparent Pricing for Every Scale</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Choose a plan that fits your needs. All plans include our core feature set.
              </p>
            </div>
            <div className="mx-auto grid max-w-sm gap-8 lg:max-w-4xl lg:grid-cols-3 mt-8">
              <PricingCard plan="Starter" price="49" features={['1 X Account', '10,000 Replies/mo', 'Basic Analytics']} />
              <PricingCard plan="Pro" price="99" features={['5 X Accounts', '50,000 Replies/mo', 'Advanced Analytics', 'Prompt Versioning']} popular />
              <PricingCard plan="Enterprise" price="Contact Us" features={['Unlimited Accounts', 'Unlimited Replies', 'Dedicated Support', 'Custom Integrations']} />
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 X-Reply Autopilot. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="grid gap-1">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function PricingCard({ plan, price, features, popular = false }: { plan: string; price: string; features: string[], popular?: boolean }) {
  return (
    <Card className={`flex flex-col ${popular ? 'border-primary' : ''}`}>
      <CardHeader>
        {popular && <div className="text-sm font-semibold text-primary mb-2">Most Popular</div>}
        <CardTitle>{plan}</CardTitle>
        <CardDescription>
          <span className="text-4xl font-bold">${price}</span>
          {price !== "Contact Us" && <span className="text-muted-foreground">/mo</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 flex-1">
        <ul className="grid gap-2 text-left">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={popular ? 'default' : 'outline'}>
          {price === "Contact Us" ? "Contact Sales" : "Get Started"}
        </Button>
      </CardFooter>
    </Card>
  );
}
