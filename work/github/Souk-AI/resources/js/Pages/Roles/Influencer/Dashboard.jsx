import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/Components/layout/Card';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Icon } from '@/Components/ui/Icon';

export default function InfluencerDashboard({ auth }) {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-primary">Total Reach</Badge>
                            <Icon name="trending_up" className="text-brand-primary" />
                        </div>
                        <CardTitle>125.4K</CardTitle>
                        <CardDescription>+5% since yesterday</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-success">Earnings</Badge>
                            <Icon name="payments" className="text-brand-primary" />
                        </div>
                        <CardTitle>$1,850.00</CardTitle>
                        <CardDescription>Pending: $420.00</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-info">Active Campaigns</Badge>
                            <Icon name="campaign" className="text-brand-primary" />
                        </div>
                        <CardTitle>4 Active</CardTitle>
                        <CardDescription>2 ending this week</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-warning">Engagement Rate</Badge>
                            <Icon name="favorite" className="text-brand-primary" />
                        </div>
                        <CardTitle>4.8%</CardTitle>
                        <CardDescription>Above average</CardDescription>
                    </CardHeader>
                </Card>
            </div>

            <div className="bg-surface-container/30 dark:bg-[#1e1e1e] rounded-[2rem] p-8 border border-outline-variant/10">
                <h3 className="text-xl font-bold mb-6">Promoted Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-surface dark:bg-[#2f2f2f] rounded-2xl border border-outline-variant/5">
                            <div className="w-16 h-16 bg-surface-container rounded-xl overflow-hidden">
                                <Icon name="image" className="m-auto mt-4 text-outline" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold">Eco-Friendly Bundle {i}</p>
                                <p className="text-sm text-on-surface-variant">Merchant: Green Living Souk</p>
                            </div>
                            <div className="text-right font-bold text-brand-primary">
                                $15.00 Commission
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
