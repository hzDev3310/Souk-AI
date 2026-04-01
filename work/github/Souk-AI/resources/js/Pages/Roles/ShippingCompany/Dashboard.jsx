import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/Components/layout/Card';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Icon } from '@/Components/ui/Icon';

export default function ShippingCompanyDashboard({ auth }) {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-primary">Active Fleets</Badge>
                            <Icon name="local_shipping" className="text-brand-primary" />
                        </div>
                        <CardTitle>42 Vehicles</CardTitle>
                        <CardDescription>All currently dispatched</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-success">Total Deliveries</Badge>
                            <Icon name="done_all" className="text-brand-primary" />
                        </div>
                        <CardTitle>1,250</CardTitle>
                        <CardDescription>99.2% success rate</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-warning">Pending Shipments</Badge>
                            <Icon name="pending_actions" className="text-brand-primary" />
                        </div>
                        <CardTitle>14</CardTitle>
                        <CardDescription>Awaiting pickup</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-info">Employees</Badge>
                            <Icon name="groups" className="text-brand-primary" />
                        </div>
                        <CardTitle>86 Drivers</CardTitle>
                        <CardDescription>Staffed at 95% capacity</CardDescription>
                    </CardHeader>
                </Card>
            </div>

            <div className="bg-surface-container/30 dark:bg-[#1e1e1e] rounded-[2rem] p-8 border border-outline-variant/10">
                <h3 className="text-xl font-bold mb-6">Logistics Overview</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-surface dark:bg-[#2f2f2f] rounded-2xl border border-outline-variant/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                                    <Icon name="map" className="text-brand-primary" />
                                </div>
                                <div>
                                    <p className="font-bold">Active Route Area #{i}</p>
                                    <p className="text-xs text-on-surface-variant">Update 12 mins ago</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Tracking Map</Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
