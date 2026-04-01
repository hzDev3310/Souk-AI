import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/Components/layout/Card';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Icon } from '@/Components/ui/Icon';

export default function ShippingEmployeeDashboard({ auth }) {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-primary">Deliveries Today</Badge>
                            <Icon name="local_shipping" className="text-brand-primary" />
                        </div>
                        <CardTitle>12 of 15</CardTitle>
                        <CardDescription>3 remaining packages</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full">Continue Route</Button>
                    </CardContent>
                </Card>

                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-success">Total Miles</Badge>
                            <Icon name="route" className="text-brand-primary" />
                        </div>
                        <CardTitle>4,250 km</CardTitle>
                        <CardDescription>Achieved over 1 month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full">View History</Button>
                    </CardContent>
                </Card>

                <Card className="bg-brand-secondary text-white">
                    <CardHeader>
                        <CardTitle className="text-white">Delivery Score</CardTitle>
                        <CardDescription className="text-white/80">98.9% customer rating</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-brand-primary text-white hover:bg-brand-primary/90">View Stats</Button>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-surface-container/30 dark:bg-[#1e1e1e] rounded-[2rem] p-8 border border-outline-variant/10">
                <h3 className="text-xl font-bold mb-6">Current Packages</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-surface dark:bg-[#2f2f2f] rounded-2xl border border-outline-variant/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                                    <Icon name="package" className="text-brand-primary" />
                                </div>
                                <div>
                                    <p className="font-bold">Order #952{i}</p>
                                    <p className="text-xs text-on-surface-variant">Avenue des Pins, Tunis</p>
                                </div>
                            </div>
                            <Badge variant={i === 1 ? 'neo-warning' : 'neo-success'}>
                                {i === 1 ? 'Priority' : 'Standard'}
                            </Badge>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
