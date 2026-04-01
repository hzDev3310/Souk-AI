import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/Components/layout/Card';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Icon } from '@/Components/ui/Icon';
import { Link } from '@inertiajs/react';

export default function Home() {
    return (
        <PublicLayout title="Souk.AI | The Intelligent Creator Marketplace">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-24 pb-32">
                {/* Decorative background glass orbs */}
                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-brand-primary/10 blur-[150px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-brand-secondary/10 blur-[150px] rounded-full animate-pulse [animation-delay:3s]"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <Badge variant="neo-primary" className="mb-8 px-6 py-2 text-sm font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-500">
                        Launching v2.0
                    </Badge>
                    
                    <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter mb-10 text-brand-secondary dark:text-white animate-in fade-in-0 duration-700">
                        Empower Your <br/>
                        <span className="text-brand-primary drop-shadow-[0_0_15px_rgba(var(--brand-primary-rgb),0.3)]">Digital Souk.</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-on-surface-variant dark:text-gray-400 max-w-3xl mx-auto mb-12 animate-in fade-in delay-200 slide-in-from-bottom-4 duration-700">
                        Connect with top-tier influencers, manage your marketplace, and track every delivery with total transparency. 
                        AI-driven insights for the modern creator.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-in fade-in delay-300 slide-in-from-bottom-4 duration-1000">
                        <Link href={route('register')}>
                            <Button className="h-16 px-10 text-xl font-bold bg-brand-primary text-white hover:bg-brand-primary/90 rounded-[2rem] shadow-2xl shadow-brand-primary/40 border-0 flex items-center gap-3 active:scale-95 transition-transform">
                                Get Started Free
                                <Icon name="arrow_forward" className="text-2xl" />
                            </Button>
                        </Link>
                        
                        <Button variant="ghost" className="h-16 px-10 text-xl font-bold flex items-center gap-3">
                            <Icon name="play_circle" className="text-3xl text-brand-primary" />
                            Watch Demo
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Stats */}
            <section className="py-24 bg-surface-container/50 dark:bg-[#1e1e1e] border-y border-outline-variant/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div className="space-y-2">
                            <h3 className="text-4xl font-black text-brand-primary">$4.2M+</h3>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-60">Creator Earnings</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-black text-brand-primary">125K+</h3>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-60">Active Users</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-black text-brand-primary">850+</h3>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-60">Verified Stores</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-black text-brand-primary">99.9%</h3>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-60">Uptime Reliability</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Features */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Everything You Need to Scale.</h2>
                    <p className="text-lg text-on-surface-variant dark:text-gray-400 max-w-2xl mx-auto">
                        We've built tools for every role in the ecosystem. Seamless integration, powerful analytics, and unbeatable UX.
                    </p>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="p-8 border-brand-primary/10 hover:border-brand-primary group transition-all duration-500 rounded-[2.5rem]">
                        <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Icon name="store" className="text-4xl text-brand-primary" />
                        </div>
                        <h4 className="text-2xl font-black mb-4">Merchant Hub</h4>
                        <p className="text-on-surface-variant dark:text-gray-400 leading-relaxed">
                            Launch your digital shop in minutes. Manage inventory, process orders, and scale your sales with ease.
                        </p>
                    </Card>

                    <Card className="p-8 border-brand-primary/10 hover:border-brand-primary group transition-all duration-500 rounded-[2.5rem]">
                        <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Icon name="campaign" className="text-4xl text-brand-primary" />
                        </div>
                        <h4 className="text-2xl font-black mb-4">Creator Studio</h4>
                        <p className="text-on-surface-variant dark:text-gray-400 leading-relaxed">
                            Influencers can browse campaigns, track engagement, and secure partnerships with top brands instantly.
                        </p>
                    </Card>

                    <Card className="p-8 border-brand-primary/10 hover:border-brand-primary group transition-all duration-500 rounded-[2.5rem]">
                        <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Icon name="local_shipping" className="text-4xl text-brand-primary" />
                        </div>
                        <h4 className="text-2xl font-black mb-4">Logistics Core</h4>
                        <p className="text-on-surface-variant dark:text-gray-400 leading-relaxed">
                            Real-time tracking for every package. Manage your delivery fleet and ensure customers get their items on time.
                        </p>
                    </Card>
                </div>
            </section>

            {/* Testimonial / Visual Break */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto h-[400px] rounded-[3rem] bg-brand-secondary dark:bg-[#1e1e1e] overflow-hidden relative group">
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-12 z-20">
                        <blockquote className="text-3xl md:text-4xl font-black text-white italic max-w-2xl leading-tight mb-8">
                            "Souk.AI transformed our boutique into a nationwide brand. The influencer network is a game-changer."
                        </blockquote>
                        <div className="flex items-center gap-4 text-white">
                            <div className="w-12 h-12 rounded-full bg-brand-primary p-1">
                                <div className="w-full h-full rounded-full bg-brand-primary flex items-center justify-center">
                                    <Icon name="person" className="text-white" />
                                </div>
                            </div>
                            <div className="text-left font-bold tracking-tight">
                                <p>Sarah Jenkins</p>
                                <p className="text-sm text-white/60">CEO, Artisan Goods Co.</p>
                            </div>
                        </div>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/20 -skew-x-12 translate-x-20 group-hover:translate-x-10 transition-transform duration-1000"></div>
                </div>
            </section>
        </PublicLayout>
    );
}
