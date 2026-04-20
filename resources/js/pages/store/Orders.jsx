import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import CardBox from "@/components/shared/CardBox";
import AdminPageLayout from "@/components/shared/AdminPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Search, 
    Eye, 
    ShoppingCart, 
    User, 
    Calendar, 
    DollarSign,
    Clock,
    CheckCircle2,
    Truck,
    Package,
    XCircle,
    ChevronDown,
    Activity,
    FileText,
    Store,
    AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/shared/Modal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const StoreOrders = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [viewingOrder, setViewingOrder] = useState(null);

    // Check if profile is incomplete
    const isProfileIncomplete = !user?.store?.name_en || !user?.store?.name_fr || !user?.store?.name_ar || !user?.store?.matriculeFiscale || !user?.store?.storePhone;

    // Redirect if profile incomplete
    useEffect(() => {
        if (isProfileIncomplete) {
            navigate('/dashboard/profile', { replace: true });
        }
    }, [isProfileIncomplete, navigate]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get("/store/orders");
            // Ensure orders is always an array
            let ordersData = [];
            if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
                ordersData = response.data.data.data;
            } else if (response.data?.data && Array.isArray(response.data.data)) {
                ordersData = response.data.data;
            } else if (response.data?.orders && Array.isArray(response.data.orders)) {
                ordersData = response.data.orders;
            } else if (Array.isArray(response.data)) {
                ordersData = response.data;
            }
            setOrders(ordersData);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId, status) => {
        try {
            await api.put(`/store/orders/${orderId}/status`, { status });
            fetchOrders();
            if (viewingOrder && viewingOrder.id === orderId) {
                const updated = await api.get(`/store/orders/${orderId}`);
                setViewingOrder(updated.data);
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case "en_cours":
            case "PENDING":
                return { label: "En Cours", color: "text-amber-500", bg: "bg-amber-500/10", icon: Clock };
            case "confirme":
            case "CONFIRMED":
                return { label: "Confirmé", color: "text-blue-500", bg: "bg-blue-500/10", icon: CheckCircle2 };
            case "en_shipping":
                return { label: "En Expédition", color: "text-indigo-500", bg: "bg-indigo-500/10", icon: Activity };
            case "shipping_company":
                return { label: "Chez le Transporteur", color: "text-purple-500", bg: "bg-purple-500/10", icon: Truck };
            case "shipped":
                return { label: "Livré", color: "text-emerald-500", bg: "bg-emerald-500/10", icon: Package };
            case "annule":
                return { label: "Annulé", color: "text-rose-500", bg: "bg-rose-500/10", icon: XCircle };
            default:
                return { label: status, color: "text-muted-foreground", bg: "bg-muted/10", icon: Activity };
        }
    };

    const filteredOrders = Array.isArray(orders) ? orders.filter(order => 
        (order.order_number && order.order_number.toLowerCase().includes(search.toLowerCase())) ||
        order.id?.toLowerCase().includes(search.toLowerCase()) ||
        order.client?.user?.name?.toLowerCase().includes(search.toLowerCase())
    ) : [];

    const updateItemStatus = async (orderId, itemId, status) => {
        try {
            await api.post(`/store/orders/${orderId}/items/${itemId}/status`, { status });
            fetchOrders();
            if (viewingOrder && viewingOrder.id === orderId) {
                const updated = await api.get(`/store/orders/${orderId}`);
                setViewingOrder(updated.data);
            }
        } catch (error) {
            console.error("Error updating item status:", error);
        }
    };

    const calculateStoreTotal = (order) => {
        if (!order.items) return 0;
        return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    return (
        <AdminPageLayout
            title={t("store.orders.title") || "My Orders"}
            subtitle={t("store.orders.subtitle") || "View and manage orders for your products"}
            icon={ShoppingCart}
        >
            <div className="space-y-6 text-start">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <Input
                            placeholder={t("store.orders.search") || "Search orders..."}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 h-12 bg-card border-border/60 rounded-2xl"
                        />
                    </div>
                </div>

                {/* Mobile View - Order Cards */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 bg-card/50 rounded-[32px] border border-border/50">
                            <Activity className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-muted-foreground font-bold">{t("store.orders.messages.loading")}</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="py-20 text-center space-y-3 bg-card/50 rounded-[32px] border border-border/50">
                            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                                <ShoppingCart size={32} />
                            </div>
                            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">{t("store.orders.messages.noOrders")}</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredOrders.map((order, idx) => {
                                const status = getStatusConfig(order.status);
                                const StatusIcon = status.icon;
                                return (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-card border border-border/60 rounded-[28px] p-5 space-y-4 shadow-sm active:scale-[0.99] transition-transform"
                                        onClick={() => setViewingOrder(order)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-black text-foreground tracking-tight leading-none mb-1">{order.order_number || `#${order.id?.slice(-8)}`}</h3>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase">{new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${status.bg}`}>
                                                <StatusIcon className={`w-3.5 h-3.5 ${status.color}`} />
                                                <span className={`text-[10px] font-black uppercase ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 py-3 border-y border-border/40">
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                                <User className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase mb-0.5">{t("store.orders.table.customer")}</p>
                                                <p className="text-sm font-bold text-foreground truncate">{order.client?.user?.name || "N/A"}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase mb-0.5">{t("store.orders.table.total")}</p>
                                                <p className="text-lg font-black text-primary">${calculateStoreTotal(order).toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Package className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-xs font-bold text-muted-foreground">{order.items?.length || 0} {t("store.orders.table.items")}</span>
                                            </div>
                                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button 
                                                            size="sm" 
                                                            variant="secondary"
                                                            className="h-10 rounded-2xl font-black text-[10px] uppercase gap-2 px-4 shadow-sm"
                                                        >
                                                            Update
                                                            <ChevronDown className="w-3 h-3" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 border-border/60 shadow-xl">
                                                        <DropdownMenuItem className="rounded-xl h-10 font-bold text-xs" onClick={() => updateStatus(order.id, "PENDING")}>
                                                            <Clock className="w-4 h-4 mr-2 text-amber-500" />
                                                            Pending
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl h-10 font-bold text-xs" onClick={() => updateStatus(order.id, "CONFIRMED")}>
                                                            <CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" />
                                                            Confirmed
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl h-10 font-bold text-xs" onClick={() => updateStatus(order.id, "SHIPPED")}>
                                                            <Truck className="w-4 h-4 mr-2 text-indigo-500" />
                                                            Shipped
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl h-10 font-bold text-xs" onClick={() => updateStatus(order.id, "DELIVERED")}>
                                                            <Package className="w-4 h-4 mr-2 text-emerald-500" />
                                                            Delivered
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl h-10 font-bold text-xs text-rose-500 focus:text-rose-600 focus:bg-rose-500/10" onClick={() => updateStatus(order.id, "CANCELLED")}>
                                                            <XCircle className="w-4 h-4 mr-2" />
                                                            Cancelled
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>

                {/* Desktop View - Table Container */}
                <CardBox className="p-0 border-border/50 rounded-[32px] overflow-hidden hidden md:block">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="border-border/50">
                                <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                                    {t("store.orders.table.order") || "ORDER"}
                                </TableHead>
                                <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                                    {t("store.orders.table.customer") || "CUSTOMER"}
                                </TableHead>
                                <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                                    {t("store.orders.table.items") || "ITEMS"}
                                </TableHead>
                                <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                                    {t("store.orders.table.total") || "STORE TOTAL"}
                                </TableHead>
                                <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                                    {t("store.orders.table.status") || "STATUS"}
                                </TableHead>
                                <TableHead className="py-5 px-6 text-end text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                                    {t("store.orders.table.actions") || "ACTIONS"}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center">
                                        <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold">
                                            <Activity className="w-5 h-5 animate-spin text-primary" />
                                            {t("store.orders.messages.loading") || "Loading..."}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredOrders.map((order) => {
                                const StatusIcon = getStatusConfig(order.status).icon;
                                return (
                                    <TableRow key={order.id} className="group hover:bg-primary/5 border-border/40 transition-colors">
                                        <TableCell className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <span className="font-black text-foreground tracking-tight">{order.order_number || `#${order.id?.slice(-8)}`}</span>
                                                <span className="text-[10px] font-bold text-muted-foreground">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium text-sm">{order.client?.user?.name || "N/A"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            <span className="text-sm font-medium">{order.items?.length || 0} items</span>
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            <span className="font-black text-primary">${calculateStoreTotal(order).toFixed(2)}</span>
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${getStatusConfig(order.status).bg}`}>
                                                <StatusIcon className={`w-3.5 h-3.5 ${getStatusConfig(order.status).color}`} />
                                                <span className={`text-xs font-bold ${getStatusConfig(order.status).color}`}>
                                                    {getStatusConfig(order.status).label}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-end">
                                            <div className="flex justify-end items-center gap-2">
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="h-9 w-9 rounded-xl text-secondary hover:bg-secondary/20"
                                                    onClick={() => setViewingOrder(order)}
                                                >
                                                    <Eye size={18} />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button 
                                                            size="sm" 
                                                            variant="ghost"
                                                            className="h-9 rounded-xl text-primary hover:bg-primary/20"
                                                        >
                                                            <span className="text-xs font-bold">Update</span>
                                                            <ChevronDown className="w-4 h-4 ml-1" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40">
                                                        <DropdownMenuItem onClick={() => updateStatus(order.id, "PENDING")}>
                                                            <Clock className="w-4 h-4 mr-2 text-amber-500" />
                                                            <span className="text-xs font-bold">Pending</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateStatus(order.id, "CONFIRMED")}>
                                                            <CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" />
                                                            <span className="text-xs font-bold">Confirmed</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateStatus(order.id, "SHIPPED")}>
                                                            <Truck className="w-4 h-4 mr-2 text-indigo-500" />
                                                            <span className="text-xs font-bold">Shipped</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateStatus(order.id, "DELIVERED")}>
                                                            <Package className="w-4 h-4 mr-2 text-emerald-500" />
                                                            <span className="text-xs font-bold">Delivered</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateStatus(order.id, "CANCELLED")}>
                                                            <XCircle className="w-4 h-4 mr-2 text-rose-500" />
                                                            <span className="text-xs font-bold text-rose-500">Cancelled</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {!loading && filteredOrders.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-20 text-center text-muted-foreground font-bold uppercase tracking-widest text-xs">
                                        {t("store.orders.messages.noOrders") || "No orders found"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBox>

                <Modal
                    isOpen={!!viewingOrder}
                    onClose={() => setViewingOrder(null)}
                    title={t("store.orders.view") || "Order Details"}
                    subtitle={viewingOrder?.order_number || `#${viewingOrder?.id?.slice(-8)}`}
                    icon={ShoppingCart}
                    maxWidth="max-w-4xl"
                    footer={
                        <div className="flex gap-3">
                            <Button onClick={() => setViewingOrder(null)} className="rounded-xl font-black bg-muted text-foreground hover:bg-muted/80">
                                {t("store.orders.view.close") || "Close"}
                            </Button>
                        </div>
                    }
                >
                    {viewingOrder && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-start">
                                <CardBox className="p-6 bg-muted/20 border-border/40 rounded-3xl">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                            <User className="text-primary" size={20} />
                                        </div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground">{t("admin.orders.view.clientInfo") || "Customer Information"}</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[10px] font-black text-muted-foreground uppercase">{t("auth.register.lastName") || "Nom"} & {t("auth.register.firstName") || "Prénom"}</p>
                                            <p className="font-bold text-foreground">{viewingOrder.client?.user?.name} {viewingOrder.client?.user?.family_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-muted-foreground uppercase">{t("auth.register.email") || "Email"}</p>
                                            <p className="font-bold text-foreground">{viewingOrder.client?.user?.email}</p>
                                        </div>
                                        {viewingOrder.shipping_address && (
                                            <div>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase">{t("store.orders.table.address") || "Shipping Address"}</p>
                                                <p className="font-bold text-foreground text-sm leading-tight">{viewingOrder.shipping_address}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardBox>

                                <CardBox className="p-6 bg-muted/20 border-border/40 rounded-3xl text-start">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center">
                                            <Activity className="text-secondary" size={20} />
                                        </div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground">STATUT & INFOS</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[10px] font-black text-muted-foreground uppercase mt-1">STATUS DE L'ORDRE</p>
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${getStatusConfig(viewingOrder.status).bg} ${getStatusConfig(viewingOrder.status).color} font-black text-[10px] uppercase mt-1`}>
                                                {React.createElement(getStatusConfig(viewingOrder.status).icon, { size: 12 })}
                                                {getStatusConfig(viewingOrder.status).label}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-muted-foreground uppercase">{t("admin.orders.table.date") || "Date"}</p>
                                            <p className="font-bold text-foreground">{new Date(viewingOrder.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </CardBox>
                            </div>

                            <div className="space-y-6 text-start">
                                <div className="flex items-center gap-3 mb-2">
                                    <ShoppingCart className="text-primary" size={20} />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground">{t("admin.orders.view.items") || "Your Products"}</h3>
                                </div>
                                
                                <CardBox className="p-0 border-border/40 rounded-[32px] overflow-hidden bg-muted/5">
                                    <Table>
                                        <TableHeader className="bg-muted/10">
                                            <TableRow className="border-border/40">
                                                <TableHead className="py-4 px-6 text-[10px] font-black uppercase text-muted-foreground">PRODUCT</TableHead>
                                                <TableHead className="py-4 px-6 text-center text-[10px] font-black uppercase text-muted-foreground">QTY</TableHead>
                                                <TableHead className="py-4 px-6 text-end text-[10px] font-black uppercase text-muted-foreground">SUBTOTAL</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {viewingOrder.items?.map((item, idx) => (
                                                <TableRow key={idx} className="border-border/40">
                                                    <TableCell className="py-4 px-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                                                                <div className="w-10 h-10 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                                                                    {item.product?.albums?.[0] ? (
                                                                        <img src={`/storage/${item.product.albums[0].file}`} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <img src="/storage/empty/empty.webp" className="w-full h-full object-cover" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-bold text-sm text-foreground mb-1 truncate">{item.product?.name_fr || item.product?.name_en}</p>
                                                                <div className="inline-block">
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button variant="ghost" size="sm" className={`h-6 text-[10px] font-black px-2 py-0 rounded-lg ${item.status === 'confirme' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : item.status === 'annule' ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20' : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'}`}>
                                                                                {item.status.toUpperCase()} <ChevronDown size={10} className="ml-1" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="start" className="rounded-xl border-border/50 shadow-2xl">
                                                                            <DropdownMenuItem onClick={() => updateItemStatus(viewingOrder.id, item.id, 'en_cours')} className="font-black text-[10px] uppercase">EN COURS</DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => updateItemStatus(viewingOrder.id, item.id, 'confirme')} className="font-black text-[10px] uppercase">CONFIRMER</DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => updateItemStatus(viewingOrder.id, item.id, 'annule')} className="font-black text-[10px] uppercase text-rose-500">ANNULER</DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 px-6 text-center font-bold text-sm">x{item.quantity}</TableCell>
                                                    <TableCell className="py-4 px-6 text-end">
                                                        <span className="font-black text-primary text-sm">{(item.price * item.quantity).toFixed(2)} TND</span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardBox>

                                <div className="flex justify-end p-6 bg-primary/5 rounded-[32px] border border-primary/10 mt-4">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase">STORE TOTAL</p>
                                        <p className="text-3xl font-black text-primary leading-none mt-1">{calculateStoreTotal(viewingOrder).toFixed(2)} TND</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </AdminPageLayout>
    );
};

export default StoreOrders;
