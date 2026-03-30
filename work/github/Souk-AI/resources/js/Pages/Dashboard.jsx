import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/Components/layout/Card';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Icon } from '@/Components/ui/Icon';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-3xl text-secondary dark:text-white leading-tight">Curator Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-primary">Active Collection</Badge>
                            <Icon name="collections" className="text-brand-primary" />
                        </div>
                        <CardTitle>Architectural Salvage</CardTitle>
                        <CardDescription>12 items currently in your curation.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full">Manage Archive</Button>
                    </CardContent>
                </Card>

                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-success">Ready to Sell</Badge>
                            <Icon name="payments" className="text-brand-primary" />
                        </div>
                        <CardTitle>Marketplace Valuation</CardTitle>
                        <CardDescription>$4,250.00 estimated total value.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full">View Appraisal</Button>
                    </CardContent>
                </Card>

                <Card className="bg-brand-secondary dark:bg-[#2C4854] text-white">
                    <CardHeader>
                        <CardTitle className="text-white">Regenerative Impact</CardTitle>
                        <CardDescription className="text-white/70">You've saved 450kg of CO2 this month.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-2 w-full bg-white/20 rounded-full mb-4 overflow-hidden">
                            <div className="h-full bg-brand-primary w-3/4 rounded-full"></div>
                        </div>
                        <Button className="w-full bg-brand-primary border-0 hover:bg-brand-primary/90">View Metrics</Button>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-12 bg-surface-container/30 dark:bg-[#1e1e1e] rounded-[2rem] p-8 border border-outline-variant/10">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-brand-primary/10 p-3 rounded-2xl">
                        <Icon name="history" className="text-brand-primary h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Recent Curator Activity</h3>
                        <p className="text-sm text-on-surface-variant">Stay updated with your latest transactions and listings.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-surface dark:bg-[#2f2f2f] rounded-2xl border border-outline-variant/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center">
                                    <Icon name="image" className="text-outline" />
                                </div>
                                <div>
                                    <p className="font-bold">Mid-Century Chair #{i+124}</p>
                                    <p className="text-xs text-on-surface-variant">Authenticated 2 hours ago</p>
                                </div>
                            </div>
                            <Badge variant="success">Completed</Badge>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
