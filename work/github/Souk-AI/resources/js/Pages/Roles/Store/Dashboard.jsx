import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/Components/layout/Card';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Icon } from '@/Components/ui/Icon';

export default function StoreDashboard({ auth }) {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-primary">Recent Sales</Badge>
                            <Icon name="payments" className="text-brand-primary" />
                        </div>
                        <CardTitle>$12,450.00</CardTitle>
                        <CardDescription>+20% this week</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-success">Total Orders</Badge>
                            <Icon name="shopping_cart" className="text-brand-primary" />
                        </div>
                        <CardTitle>142</CardTitle>
                        <CardDescription>Waitlist for 12 items</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-info">Inventory</Badge>
                            <Icon name="inventory_2" className="text-brand-primary" />
                        </div>
                        <CardTitle>485 Items</CardTitle>
                        <CardDescription>Across 3 stores</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-warning">Low Stock</Badge>
                            <Icon name="warning" className="text-brand-primary" />
                        </div>
                        <CardTitle>12 Warnings</CardTitle>
                        <CardDescription>Needs restocking</CardDescription>
                    </CardHeader>
                </Card>
            </div>

            <div className="bg-surface-container/30 dark:bg-[#1e1e1e] rounded-[2rem] p-8 border border-outline-variant/10">
                <h3 className="text-xl font-bold mb-6">Store Performance Overview</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-surface dark:bg-[#2f2f2f] rounded-2xl border border-outline-variant/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                                    <Icon name="bar_chart" className="text-brand-primary" />
                                </div>
                                <div>
                                    <p className="font-bold">Store #{i} Activity</p>
                                    <p className="text-xs text-on-surface-variant">Update 1 hour ago</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Manage Stock</Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
