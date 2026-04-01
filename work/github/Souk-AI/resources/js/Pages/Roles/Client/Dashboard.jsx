import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/Components/layout/Card';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Icon } from '@/Components/ui/Icon';

export default function ClientDashboard({ auth }) {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-primary">My Orders</Badge>
                            <Icon name="shopping_cart" className="text-brand-primary" />
                        </div>
                        <CardTitle>5 Active Orders</CardTitle>
                        <CardDescription>Track your current purchases.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full">Track Orders</Button>
                    </CardContent>
                </Card>

                <Card className="hover:border-brand-primary">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge variant="neo-success">Wishlist</Badge>
                            <Icon name="favorite" className="text-brand-primary" />
                        </div>
                        <CardTitle>12 Items</CardTitle>
                        <CardDescription>Saved for later.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full">View Wishlist</Button>
                    </CardContent>
                </Card>

                <Card className="bg-brand-primary text-white">
                    <CardHeader>
                        <CardTitle className="text-white">Souk Points</CardTitle>
                        <CardDescription className="text-white/80">You have 1,250 points to spend.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-white text-brand-primary hover:bg-white/90">Redeem Now</Button>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-surface-container/30 dark:bg-[#1e1e1e] rounded-[2rem] p-8 border border-outline-variant/10">
                <h3 className="text-xl font-bold mb-6">Recommended for You</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="group relative overflow-hidden rounded-2xl aspect-square bg-surface dark:bg-[#2f2f2f] border border-outline-variant/5">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                                <p className="text-white font-bold">Trending Item {i}</p>
                                <p className="text-white/70 text-sm">$49.99</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
