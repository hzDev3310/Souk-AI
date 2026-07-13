import React, { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

const CATEGORY_ICONS = [
    'Tag', 'Box', 'ShoppingBag', 'ShoppingCart', 'Store', 'Home', 'Heart', 'Star',
    'Gift', 'Sparkles', 'Gem', 'Crown', 'Shirt', 'Footprints', 'Watch', 'Sunglasses',
    'Laptop', 'Smartphone', 'Monitor', 'Headphones', 'Camera', 'Tv', 'Speaker',
    'Dumbbell', 'Bike', 'Tent', 'Plane', 'Car', 'Ship', 'Truck',
    'Apple', 'Coffee', 'UtensilsCrossed', 'Cake', 'IceCream', 'Wine', 'Beer', 'Egg',
    'BookOpen', 'GraduationCap', 'Palette', 'Music', 'Film', 'Gamepad2', 'Trophy',
    'Flower2', 'Leaf', 'TreePine', 'Sun', 'Moon', 'Cloud', 'Snowflake',
    'PawPrint', 'Bird', 'Fish', 'Bug', 'Snail',
    'Baby', 'Users', 'User', 'UsersRound', 'HeartHandshake', 'HandHeart',
    'Pill', 'Syringe', 'Stethoscope', 'Thermometer', 'HeartPulse',
    'Brush', 'PenTool', 'Ruler', 'Scissors', 'WandSparkles',
    'Banknote', 'CreditCard', 'Wallet', 'Coins', 'Receipt',
    'Package', 'Boxes', 'Warehouse', 'Container',
    'Hammer', 'Wrench', 'Screwdriver', 'Drill', 'HardHat',
    'Zap', 'Lightbulb', 'Flame', 'Droplets', 'Wind',
    'Globe', 'MapPin', 'Compass', 'Anchor', 'Mountain',
    'Shield', 'Lock', 'Key', 'Eye', 'Bell',
    'Calendar', 'Clock', 'Timer', 'Hourglass', 'AlarmClock',
    'Mail', 'MessageCircle', 'Phone', 'Video', 'Radio',
    'Image', 'Music2', 'Mic', 'Volume2',
    'Download', 'Upload', 'Share2', 'Link', 'QrCode',
    'Settings', 'SlidersHorizontal', 'ToggleLeft', 'RefreshCw', 'RotateCcw',
    'Search', 'Filter', 'SortAsc', 'LayoutGrid', 'List',
    'Check', 'X', 'Plus', 'Minus', 'ArrowRight',
    'ChevronRight', 'ChevronDown', 'ChevronUp', 'MoreHorizontal', 'Move',
    'TrendingUp', 'BarChart3', 'PieChart', 'Activity', 'Target',
    'Award', 'Medal', 'Ribbon', 'BadgeCheck', 'Verified',
];

const IconPicker = ({ value, onChange, className = '' }) => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const filteredIcons = useMemo(() => {
        const q = search.toLowerCase();
        return CATEGORY_ICONS.filter(name => name.toLowerCase().includes(q));
    }, [search]);

    const SelectedIcon = value && LucideIcons[value] ? LucideIcons[value] : null;

    return (
        <div className={`relative ${className}`}>
            <div
                className="w-full h-12 bg-muted/30 border border-border/50 rounded-xl px-4 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                {SelectedIcon ? (
                    <>
                        <SelectedIcon size={18} className="text-primary flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground truncate">{value}</span>
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onChange(''); setSearch(''); }}
                            className="ml-auto text-muted-foreground hover:text-foreground"
                        >
                            <X size={14} />
                        </button>
                    </>
                ) : (
                    <span className="text-sm text-muted-foreground">Click to select an icon</span>
                )}
            </div>

            {isOpen && (
                <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-card border border-border/50 rounded-2xl shadow-2xl p-3 space-y-3">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search icons..."
                        className="h-10 bg-muted/30 border-border/50 rounded-xl text-sm"
                        autoFocus
                    />
                    <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                        {filteredIcons.map((name) => {
                            const Icon = LucideIcons[name];
                            if (!Icon) return null;
                            return (
                                <button
                                    key={name}
                                    type="button"
                                    title={name}
                                    onClick={() => { onChange(name); setIsOpen(false); setSearch(''); }}
                                    className={`p-2 rounded-xl hover:bg-primary/10 transition-all flex items-center justify-center ${
                                        value === name ? 'bg-primary/20 text-primary ring-2 ring-primary/30' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <Icon size={18} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default IconPicker;
