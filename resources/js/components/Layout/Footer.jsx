import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-950 pt-20 pb-10 border-t border-gray-100 dark:border-gray-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-black text-sm">E</span>
                            </div>
                            <span className="text-lg font-bold">EcoMarket</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            The sustainable marketplace connecting conscious consumers with eco-friendly stores and influencers.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-emerald-600 transition-colors">Marketplace</a></li>
                            <li><a href="#" className="hover:text-emerald-600 transition-colors">Seller Dashboard</a></li>
                            <li><a href="#" className="hover:text-emerald-600 transition-colors">Influencer Portal</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-emerald-600 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Contact</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li>sayari@ecomarket.test</li>
                            <li>+216 00 000 000</li>
                            <li>Tunis, Tunisia</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-gray-50 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-400 font-medium">© 2026 EcoMarket. Built with passion for a greener future.</p>
                    <div className="flex gap-6">
                        {/* Social icons can go here */}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
