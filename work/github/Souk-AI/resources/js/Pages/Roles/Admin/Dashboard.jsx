import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/Components/layout/Card';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Icon } from '@/Components/ui/Icon';

export default function AdminDashboard({ auth }) {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-primary">Total Users</Badge>
                            <Icon name="people" className="text-brand-primary" />
                        </div>
                        <CardTitle>1,284</CardTitle>
                        <CardDescription>+12% from last month</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-success">Revenue</Badge>
                            <Icon name="payments" className="text-brand-primary" />
                        </div>
                        <CardTitle>$45,250.00</CardTitle>
                        <CardDescription>+8% from last month</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-warning">Pending Reports</Badge>
                            <Icon name="report" className="text-brand-primary" />
                        </div>
                        <CardTitle>14</CardTitle>
                        <CardDescription>Requires immediate attention</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-info">Active Stores</Badge>
                            <Icon name="storefront" className="text-brand-primary" />
                        </div>
                        <CardTitle>86</CardTitle>
                        <CardDescription>Across 12 categories</CardDescription>
                    </CardHeader>
                </Card>
            </div>

            <div className="bg-surface-container/30 dark:bg-[#1e1e1e] rounded-[2rem] p-8 border border-outline-variant/10">
                <h3 className="text-xl font-bold mb-6">Recent Administrative Actions</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-surface dark:bg-[#2f2f2f] rounded-2xl border border-outline-variant/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                                    <Icon name="admin_panel_settings" className="text-brand-primary" />
                                </div>
                                <div>
                                    <p className="font-bold">System Update v2.{i}.0</p>
                                    <p className="text-xs text-on-surface-variant">Deployed by Admin 4 hours ago</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">View Log</Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
