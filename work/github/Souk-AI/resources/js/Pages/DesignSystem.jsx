import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Navbar } from '@/Components/layout/Navbar';
import { BottomTabBar } from '@/Components/layout/BottomTabBar';
import { Sidebar } from '@/Components/layout/Sidebar';
import { Button } from '@/Components/ui/Button';
import { Input, FloatingLabelInput } from '@/Components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/Select';
import { Checkbox } from '@/Components/ui/Checkbox';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/RadioGroup';
import { Slider } from '@/Components/ui/Slider';
import { Badge } from '@/Components/ui/Badge';
import { Alert, AlertTitle, AlertDescription } from '@/Components/ui/Alert';
import { Progress } from '@/Components/ui/Progress';
import { Spinner } from '@/Components/ui/Spinner';
import { Icon } from '@/Components/ui/Icon';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/Components/layout/Card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/Components/layout/Accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/layout/Modal';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/layout/Offcanvas';
import { Carousel } from '@/Components/layout/Carousel';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/Components/ui/Breadcrumbs';
import { Pagination } from '@/Components/ui/Pagination';
import { ThemeProvider } from '@/Contexts/ThemeProvider';
import { LanguageProvider } from '@/Contexts/LanguageProvider';

const Section = ({ title, description, children }) => (
    <section className="mb-16">
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-2">{title}</h2>
            <p className="text-on-surface-variant max-w-2xl">{description}</p>
        </div>
        <div className="bg-surface-container/30 p-8 rounded-[2rem] border border-outline-variant/10">
            {children}
        </div>
    </section>
);

const DesignSystem = () => {
    const [page, setPage] = useState(1);
    const mockImages = [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuACQEzko1_J9NytjDgNDLVVGGN668HXdUlU0938O9YDT_SRfre81UhBun5RgfbhzgySUjhqr3nmYmC8TO-f7fwy9MoPi3hY96HrjOCqGn1qejyXMX3v1572OEcEQEal28--eFIuVmB0NCLL8jVP3E6NPUyj3y7pi-8zc1WwDQAazvWzbvj3o7S5MqIDeS1VlNXnXEhNsun9jotvCiEOVaN_-PIhJlMyP3Ru12hD-77ORbZlartBusdf9hpdKml_KDOn0QpKI_Sv4CI",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuACQEzko1_J9NytjDgNDLVVGGN668HXdUlU0938O9YDT_SRfre81UhBun5RgfbhzgySUjhqr3nmYmC8TO-f7fwy9MoPi3hY96HrjOCqGn1qejyXMX3v1572OEcEQEal28--eFIuVmB0NCLL8jVP3E6NPUyj3y7pi-8zc1WwDQAazvWzbvj3o7S5MqIDeS1VlNXnXEhNsun9jotvCiEOVaN_-PIhJlMyP3Ru12hD-77ORbZlartBusdf9hpdKml_KDOn0QpKI_Sv4CI"
    ];

    const sidebarItems = [
        { label: 'Overview', icon: 'grid_view', href: '#overview' },
        { label: 'Action Elements', icon: 'smart_button', href: '#actions' },
        { label: 'Containers', icon: 'layers', href: '#containers' },
    ];

    return (
        <ThemeProvider>
            <LanguageProvider>
                <div className="min-h-screen bg-surface">
                    <Head title="Souk.AI Design System" />
                    
                    <Navbar />

                    <main className="max-w-7xl mx-auto px-6 pt-32 pb-40">
                        <header className="mb-20">
                            <Breadcrumb className="mb-4">
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Design System</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                            <h1 className="text-5xl font-extrabold tracking-tight mb-4">Architecture of Sophistication</h1>
                            <p className="text-xl text-on-surface-variant max-w-3xl">A regenerative design language for the circular economy. Modular, high-contrast, and RTL-ready elements optimized for Souk.AI.</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                            <Sidebar className="md:col-span-3 hidden md:block" items={sidebarItems} activePath="#overview" />

                            <div className="md:col-span-9">
                                {/* Branding Section */}
                                <Section title="Brand Palette" description="Core colors tailored for architectural salvage and regenerative commerce.">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <div className="h-24 bg-brand-primary rounded-2xl shadow-lg"></div>
                                            <span className="text-xs font-bold">#198754 (Primary)</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="h-24 bg-brand-secondary rounded-2xl shadow-lg"></div>
                                            <span className="text-xs font-bold">#2C4854 (Secondary)</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="h-24 bg-surface-container rounded-2xl border"></div>
                                            <span className="text-xs font-bold">Surface Container</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="h-24 bg-error rounded-2xl"></div>
                                            <span className="text-xs font-bold">Error State</span>
                                        </div>
                                    </div>
                                </Section>

                                {/* Buttons Section */}
                                <Section title="Actions & Buttons" description="High-visibility interaction points with tonal feedback.">
                                    <div className="flex flex-wrap gap-4 items-center">
                                        <Button variant="primary">Primary Action</Button>
                                        <Button variant="success" className="shadow-brand-primary/20">Success Action</Button>
                                        <Button variant="outline">Secondary</Button>
                                        <Button variant="ghost" size="icon"><Icon name="share" /></Button>
                                        <Button variant="danger">Delete</Button>
                                    </div>
                                </Section>

                                {/* Badges & State */}
                                <Section title="Identity & State" description="Visual indicators for product condition and reward tiers.">
                                    <div className="flex flex-wrap gap-4">
                                        <Badge variant="new">New Arrival</Badge>
                                        <Badge variant="good">Good Condition</Badge>
                                        <Badge variant="used">Used Item</Badge>
                                        <Badge variant="success">Eco Certified</Badge>
                                    </div>
                                </Section>

                                {/* Forms Section */}
                                <Section title="Input Architecture" description="Editorial-grade form elements with high-contrast valid/invalid states.">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
                                        <div className="space-y-4">
                                            <label className="text-sm font-bold text-outline">Standard Input</label>
                                            <Input placeholder="Search the archive..." />
                                            <Input success placeholder="Identity Verified" defaultValue="Alexander Curator" />
                                            <Input error placeholder="Invalid Email" defaultValue="alexander@invalid" />
                                        </div>
                                        <div className="space-y-8">
                                            <label className="text-sm font-bold text-outline">Floating Strategy</label>
                                            <FloatingLabelInput label="Vault Identifier" id="vault" />
                                            <FloatingLabelInput label="Passkey" type="password" id="pass" />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-sm font-bold text-outline">Selection</label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="salvage">Architectural Salvage</SelectItem>
                                                    <SelectItem value="mid-century">Mid-Century Modern</SelectItem>
                                                    <SelectItem value="textiles">Regenerative Textiles</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-sm font-bold text-outline">Selection Controls</label>
                                            <div className="flex items-center gap-2">
                                                <Checkbox id="check1" checked />
                                                <label htmlFor="check1" className="text-sm font-medium">Market Alerts</label>
                                            </div>
                                            <RadioGroup defaultValue="public">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="public" id="r1" />
                                                    <label htmlFor="r1" className="text-sm">Public Gallery</label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="private" id="r2" />
                                                    <label htmlFor="r2" className="text-sm">Private Archive</label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                </Section>

                                {/* Sliders & Progress */}
                                <Section title="Refinement & Metric" description="Dual-point refinement sliders and sustainability tracking.">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-6">
                                            <label className="text-sm font-bold text-outline">Valuation Range</label>
                                            <Slider defaultValue={[20, 80]} max={100} step={1} />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-outline">
                                                <span>Gold Member</span>
                                                <span>65% to Platinum</span>
                                            </div>
                                            <Progress value={65} />
                                        </div>
                                    </div>
                                </Section>

                                {/* Feedback Section */}
                                <Section title="Feedback Systems" description="Contextual alerts and real-time notifications.">
                                    <div className="space-y-4">
                                        <Alert variant="success">
                                            <Icon name="check_circle" className="h-4 w-4" />
                                            <AlertTitle>Lead Secured Successfully</AlertTitle>
                                            <AlertDescription>The curator has been notified of your interest.</AlertDescription>
                                        </Alert>
                                        <Alert variant="info">
                                            <Icon name="info" className="h-4 w-4" />
                                            <AlertTitle>Verification Pending</AlertTitle>
                                            <AlertDescription>Your item is currently undergoing quality appraisal.</AlertDescription>
                                        </Alert>
                                        <div className="flex items-center gap-8 pt-4">
                                            <Spinner size="lg" />
                                            <Spinner size="md" />
                                            <Spinner size="sm" />
                                        </div>
                                    </div>
                                </Section>

                                {/* Containers Section */}
                                <Section title="Editorial Containers" description="Rich cards and interactive galleries for high-value assets.">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <Card className="overflow-hidden">
                                            <Carousel images={mockImages} className="h-64" />
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <CardTitle>Chronos Ethereal</CardTitle>
                                                    <span className="text-brand-primary font-bold text-lg">$249.00</span>
                                                </div>
                                                <CardDescription>Sustainably sourced materials meet timeless Swiss movement.</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex gap-2 mb-4">
                                                    <Badge variant="new">New Arrival</Badge>
                                                    <Badge variant="success">Eco Choice</Badge>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="border-t border-outline-variant/10 pt-4">
                                                <Button size="sm" className="w-full">View Details</Button>
                                            </CardFooter>
                                        </Card>

                                        <div className="space-y-6">
                                            <Accordion type="single" collapsible className="w-full">
                                                <AccordionItem value="item-1">
                                                    <AccordionTrigger>How does regenerative shipping work?</AccordionTrigger>
                                                    <AccordionContent>
                                                        Our logistics network uses proprietary AI to optimize routes and reduce carbon impact by 45%.
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="item-2">
                                                    <AccordionTrigger>What is the 'State of Wear' badge?</AccordionTrigger>
                                                    <AccordionContent>
                                                        It's an AI-verified metric that ensures transparency in the pre-owned market.
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>

                                            <div className="flex gap-4">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline">Open Share Panel</Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Share Link</DialogTitle>
                                                            <DialogDescription>Copy the asset link to share with your curators.</DialogDescription>
                                                        </DialogHeader>
                                                        <div className="py-4">
                                                            <Input readOnly value="https://souk.ai/asset/chronos-ethereal" />
                                                        </div>
                                                        <Button className="w-full">Copy Link</Button>
                                                    </DialogContent>
                                                </Dialog>

                                                <Sheet>
                                                    <SheetTrigger asChild>
                                                        <Button variant="outline">Mobile Categories</Button>
                                                    </SheetTrigger>
                                                    <SheetContent side="right">
                                                        <SheetHeader>
                                                            <SheetTitle>Categories</SheetTitle>
                                                            <SheetDescription>Browse the regenerative archive.</SheetDescription>
                                                        </SheetHeader>
                                                        <div className="py-8 space-y-4">
                                                            <Button variant="ghost" className="w-full justify-start">Architectural Salvage</Button>
                                                            <Button variant="ghost" className="w-full justify-start">Mid-Century Modern</Button>
                                                        </div>
                                                    </SheetContent>
                                                </Sheet>
                                            </div>
                                        </div>
                                    </div>
                                </Section>

                                {/* Navigation & Pagination */}
                                <Section title="Flow & Hierarchy" description="Consistent navigation and pagination for large catalogues.">
                                    <Pagination currentPage={page} totalPages={12} onPageChange={setPage} />
                                </Section>
                            </div>
                        </div>
                    </main>

                    <BottomTabBar />
                </div>
            </LanguageProvider>
        </ThemeProvider>
    );
};

export default DesignSystem;
