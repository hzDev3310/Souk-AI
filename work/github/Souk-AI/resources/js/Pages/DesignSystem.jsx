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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/Components/layout/Dropdown';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/Components/ui/Tooltip';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/Tabs';
import { ListGroup, ListGroupItem } from '@/Components/ui/ListGroup';
import { Popover, PopoverTrigger, PopoverContent } from '@/Components/ui/Popover';
import { ToastContainer } from '@/Components/ui/ToastContainer';
import { useToast } from '@/hooks/useToast';
import { ThemeProvider } from '@/Contexts/ThemeProvider';
import { LanguageProvider } from '@/Contexts/LanguageProvider';

const Section = ({ title, description, children }) => (
    <section className="mb-16 dark:bg-[#1e1e1e] dark:border-[#3a3a3a] rounded-2xl p-6">
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-secondary dark:text-[#90caf9] mb-2">{title}</h2>
            <p className="text-on-surface-variant dark:text-[#b0b0b0] max-w-2xl">{description}</p>
        </div>
        <div className="bg-surface-container/30 dark:bg-[#2f2f2f] p-8 rounded-[2rem] border border-outline-variant/10 dark:border-[#3a3a3a]">
            {children}
        </div>
    </section>
);

const DesignSystem = () => {
    const [page, setPage] = useState(1);
    const { toasts, addToast, removeToast } = useToast();
    const mockImages = [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1493119508027-538efe07d697?w=500&h=500&fit=crop"
    ];

    const sidebarItems = [
        { label: 'Overview', icon: 'grid_view' },
        { label: 'Colors', icon: 'palette' },
        { label: 'Buttons & Actions', icon: 'smart_button' },
        { label: 'Badges & State', icon: 'label' },
        { label: 'Form Inputs', icon: 'input' },
        { label: 'Sliders & Progress', icon: 'trending_up' },
        { label: 'Feedback', icon: 'notifications' },
        { label: 'Containers', icon: 'layers' },
        { label: 'Navigation', icon: 'navigation' },
        { label: 'Dropdowns', icon: 'menu' },
        { label: 'Button Groups', icon: 'group' },
        { label: 'Lists', icon: 'list' },
        { label: 'Collapse', icon: 'unfold_less' },
        { label: 'Tooltips', icon: 'info' },
        { label: 'Popovers', icon: 'chat_bubble' },
        { label: 'Close Buttons', icon: 'close' },
        { label: 'Toasts', icon: 'notifications_active' },
        { label: 'Scrollspy', icon: 'unfold_more' },
        { label: 'Navbar', icon: 'app_bar' },
        { label: 'Offcanvas', icon: 'menu_open' },
        { label: 'Modal', icon: 'window' },
    ];

    return (
        <ThemeProvider>
            <LanguageProvider>
                <div className="min-h-screen bg-surface dark:bg-[#121212] text-on-surface dark:text-[#e0e0e0]">
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
                            <Sidebar className="md:col-span-3 hidden md:block" items={sidebarItems} />

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
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-sm font-bold text-outline dark:text-[#b0b0b0] mb-3">Solid Badges</h4>
                                            <div className="flex flex-wrap gap-3">
                                                <Badge variant="new">New Arrival</Badge>
                                                <Badge variant="good">Good Condition</Badge>
                                                <Badge variant="used">Used Item</Badge>
                                                <Badge variant="success">Success</Badge>
                                                <Badge variant="warning">Warning</Badge>
                                                <Badge variant="error">Error</Badge>
                                                <Badge variant="info">Info</Badge>
                                                <Badge variant="eco">Eco Certified</Badge>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-outline dark:text-[#b0b0b0] mb-3">Neo Badges (Outline)</h4>
                                            <div className="flex flex-wrap gap-3">
                                                <Badge variant="neo-primary">Primary</Badge>
                                                <Badge variant="neo-success">Success</Badge>
                                                <Badge variant="neo-error">Error</Badge>
                                                <Badge variant="neo-warning">Warning</Badge>
                                                <Badge variant="neo-info">Info</Badge>
                                                <Badge variant="neo-secondary">Secondary</Badge>
                                            </div>
                                        </div>
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

                                {/* Tabs & Navigation */}
                                <Section title="Navs & Tabs" description="Tabbed navigation for organizing content sections.">
                                    <Tabs defaultValue="tab1" className="w-full">
                                        <TabsList>
                                            <TabsTrigger value="tab1">Architectural Salvage</TabsTrigger>
                                            <TabsTrigger value="tab2">Sustainable Materials</TabsTrigger>
                                            <TabsTrigger value="tab3">Premium Collections</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="tab1" className="pt-4">
                                            <p className="text-on-surface-variant">Reclaimed architectural elements from heritage buildings.</p>
                                        </TabsContent>
                                        <TabsContent value="tab2" className="pt-4">
                                            <p className="text-on-surface-variant">Eco-friendly materials from regenerative sources.</p>
                                        </TabsContent>
                                        <TabsContent value="tab3" className="pt-4">
                                            <p className="text-on-surface-variant">Curated collections for discerning collectors.</p>
                                        </TabsContent>
                                    </Tabs>
                                </Section>

                                {/* Dropdowns & Menus */}
                                <Section title="Dropdowns" description="Contextual menu options and action selectors.">
                                    <div className="flex flex-wrap gap-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline">Open Menu</Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem>Add to Watchlist</DropdownMenuItem>
                                                <DropdownMenuItem>Share Item</DropdownMenuItem>
                                                <DropdownMenuItem className="text-error">Report Listing</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </Section>

                                {/* Button Groups */}
                                <Section title="Button group" description="Related buttons grouped for cohesive action sets.">
                                    <div className="space-y-4">
                                        <div className="flex gap-0 border border-outline-variant rounded-lg overflow-hidden">
                                            <Button variant="ghost" className="rounded-none border-r border-outline-variant/10 flex-1">List View</Button>
                                            <Button variant="ghost" className="rounded-none border-r border-outline-variant/10 flex-1">Grid View</Button>
                                            <Button variant="ghost" className="rounded-none flex-1">Map View</Button>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline">Sort</Button>
                                            <Button size="sm" variant="outline">Filter</Button>
                                            <Button size="sm" variant="outline">Save</Button>
                                        </div>
                                    </div>
                                </Section>

                                {/* List Groups */}
                                <Section title="List group" description="Organized lists for displaying items and content.">
                                    <ListGroup>
                                        <ListGroupItem active>Active Item - Featured</ListGroupItem>
                                        <ListGroupItem>Standard List Item</ListGroupItem>
                                        <ListGroupItem disabled>Disabled Item</ListGroupItem>
                                        <ListGroupItem>Recent Category</ListGroupItem>
                                    </ListGroup>
                                </Section>

                                {/* Collapse */}
                                <Section title="Collapse" description="Expandable content sections for hiding/showing details.">
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="collapse-1">
                                            <AccordionTrigger>Shipping & Returns Policy</AccordionTrigger>
                                            <AccordionContent>
                                                All items include free return shipping within 30 days. We partner with regenerative logistics providers to minimize carbon impact.
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="collapse-2">
                                            <AccordionTrigger>Authentication & Provenance</AccordionTrigger>
                                            <AccordionContent>
                                                Each piece is verified by our expert curators. Digital certificates of authenticity are provided with all purchases.
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="collapse-3">
                                            <AccordionTrigger>Warranty & Guarantees</AccordionTrigger>
                                            <AccordionContent>
                                                We offer a 1-year structural guarantee on all architectural salvage. Refurbished items come with a 2-year mechanical warranty.
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </Section>

                                {/* Tooltips */}
                                <Section title="Tooltips" description="Contextual information on hover or focus.">
                                    <TooltipProvider>
                                        <div className="flex gap-4 flex-wrap">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="outline">Hover me</Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Learn more about this item
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Icon name="info_outlined" className="h-5 w-5 cursor-help text-outline" />
                                                </TooltipTrigger>
                                                <TooltipContent side="right">
                                                    This feature is currently in beta
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </TooltipProvider>
                                </Section>

                                {/* Popovers */}
                                <Section title="Popovers" description="Rich content containers that appear next to a trigger element.">
                                    <div className="flex gap-4">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button>Open Popover</Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-bold">Item Details</h4>
                                                    <p className="text-sm text-on-surface-variant">
                                                        This mid-century modern chair is in excellent condition with original upholstery. Estimated value: $450 - $600.
                                                    </p>
                                                    <Button size="sm" className="w-full">Make Offer</Button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </Section>

                                {/* Close Button */}
                                <Section title="Close button" description="Dismissible buttons for alerts, modals, and offcanvas.">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between bg-surface-container/50 p-4 rounded-lg border border-outline-variant/10">
                                            <span className="text-sm">You have a new message</span>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-error/10">
                                                <Icon name="close" className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between bg-success/10 p-4 rounded-lg border border-success/20">
                                            <span className="text-sm font-medium">Item added to cart successfully</span>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-surface-variant">
                                                <Icon name="close" className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Section>

                                {/* Toasts */}
                                <Section title="Toasts" description="Non-intrusive notifications for confirming actions.">
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                onClick={() => addToast({
                                                    title: "Success!",
                                                    description: "Your action has been completed successfully.",
                                                    variant: "success",
                                                    duration: 5000
                                                })}
                                            >
                                                Show Success Toast
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                onClick={() => addToast({
                                                    title: "Information",
                                                    description: "This is an informational notification.",
                                                    variant: "default",
                                                    duration: 5000
                                                })}
                                            >
                                                Show Info Toast
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                onClick={() => addToast({
                                                    title: "Warning",
                                                    description: "Please review this important message.",
                                                    variant: "destructive",
                                                    duration: 5000
                                                })}
                                            >
                                                Show Warning Toast
                                            </Button>
                                        </div>
                                        <div className="text-xs text-on-surface-variant dark:text-[#b0b0b0] italic">
                                            Toast notifications appear in the bottom-right corner of the screen
                                        </div>
                                    </div>
                                </Section>

                                {/* Progress & Spinners */}
                                <Section title="Progress" description="Visual indicators for loading states and completion.">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-outline">Item Upload Progress</label>
                                            <Progress value={45} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-outline">Processing Complete</label>
                                            <Progress value={100} />
                                        </div>
                                    </div>
                                </Section>

                                {/* Spinners */}
                                <Section title="Spinners" description="Animated loading indicators for async operations.">
                                    <div className="space-y-8">
                                        <div>
                                            <h4 className="text-sm font-bold text-outline dark:text-[#b0b0b0] mb-4">Size Variations</h4>
                                            <div className="flex items-center gap-8">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Spinner size="lg" color="primary" />
                                                    <span className="text-xs text-on-surface-variant dark:text-[#b0b0b0]">Large</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-2">
                                                    <Spinner size="md" color="primary" />
                                                    <span className="text-xs text-on-surface-variant dark:text-[#b0b0b0]">Medium</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-2">
                                                    <Spinner size="sm" color="primary" />
                                                    <span className="text-xs text-on-surface-variant dark:text-[#b0b0b0]">Small</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-outline dark:text-[#b0b0b0] mb-4">Color Variations</h4>
                                            <div className="flex items-center gap-8">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Spinner size="md" color="primary" />
                                                    <span className="text-xs text-on-surface-variant dark:text-[#b0b0b0]">Primary</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-2">
                                                    <Spinner size="md" color="success" className="text-success" />
                                                    <span className="text-xs text-on-surface-variant dark:text-[#b0b0b0]">Success</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-2">
                                                    <Spinner size="md" color="error" className="text-error" />
                                                    <span className="text-xs text-on-surface-variant dark:text-[#b0b0b0]">Error</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-2">
                                                    <Spinner size="md" color="secondary" className="text-brand-secondary" />
                                                    <span className="text-xs text-on-surface-variant dark:text-[#b0b0b0]">Secondary</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Section>

                                {/* Scrollspy Example */}
                                <Section title="Scrollspy" description="Automatically activate navigation items based on scroll position.">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div className="space-y-2 border-l-2 border-outline-variant/20 pl-4">
                                            <div className="font-bold text-sm cursor-pointer hover:text-brand-primary transition-colors">Overview</div>
                                            <div className="text-sm text-on-surface-variant cursor-pointer hover:text-primary transition-colors">Features & Benefits</div>
                                            <div className="text-sm text-on-surface-variant cursor-pointer hover:text-primary transition-colors">How It Works</div>
                                        </div>
                                        <div className="md:col-span-3">
                                            <div className="space-y-4 bg-surface-container/30 p-6 rounded-lg">
                                                <h3 className="font-bold">Content Section 1</h3>
                                                <p className="text-sm text-on-surface-variant">As you scroll through this content, the navigation items on the left update to reflect your position on the page.</p>
                                            </div>
                                        </div>
                                    </div>
                                </Section>

                                {/* Navbar Example */}
                                <Section title="Navbar" description="Top navigation bar with branding and links.">
                                    <div className="text-xs text-on-surface-variant p-4 bg-surface-container/30 rounded-lg border border-outline-variant/10">
                                        <p>The Navbar component is displayed at the top of the page. It includes branding, navigation links, search functionality, and user account options.</p>
                                    </div>
                                </Section>

                                {/* Offcanvas Example */}
                                <Section title="Offcanvas" description="Side panels that slide in from the edge for mobile navigation.">
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button variant="outline">Open Offcanvas</Button>
                                        </SheetTrigger>
                                        <SheetContent side="right">
                                            <SheetHeader>
                                                <SheetTitle>Navigation Menu</SheetTitle>
                                                <SheetDescription>Browse categories and account options</SheetDescription>
                                            </SheetHeader>
                                            <div className="py-8 space-y-4">
                                                <Button variant="ghost" className="w-full justify-start text-base">Browse Items</Button>
                                                <Button variant="ghost" className="w-full justify-start text-base">My Collection</Button>
                                                <Button variant="ghost" className="w-full justify-start text-base">Messages</Button>
                                                <Button variant="ghost" className="w-full justify-start text-base">Watchlist</Button>
                                                <div className="border-t border-outline-variant/10 pt-4 mt-4">
                                                    <Button variant="ghost" className="w-full justify-start text-base">Account Settings</Button>
                                                    <Button variant="ghost" className="w-full justify-start text-base">Sign Out</Button>
                                                </div>
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </Section>

                                {/* Modal Example */}
                                <Section title="Modal" description="Centered content overlays for focused user interactions.">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button>Open Modal</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Confirm Purchase</DialogTitle>
                                                <DialogDescription>Please review your order before proceeding to checkout.</DialogDescription>
                                            </DialogHeader>
                                            <div className="py-6 space-y-4">
                                                <div className="border border-outline-variant rounded-lg p-4">
                                                    <h4 className="font-bold mb-2">Order Summary</h4>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span>Mid-Century Dining Chair</span>
                                                        <span className="font-bold">$450.00</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm text-on-surface-variant">
                                                        <span>Shipping</span>
                                                        <span>Free</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" className="flex-1">Cancel</Button>
                                                    <Button className="flex-1">Proceed to Checkout</Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </Section>
                            </div>
                        </div>
                    </main>

                    <BottomTabBar />
                </div>
                <ToastContainer toasts={toasts} removeToast={removeToast} />
            </LanguageProvider>
        </ThemeProvider>
    );
};

export default DesignSystem;
