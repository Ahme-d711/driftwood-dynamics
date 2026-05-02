import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreHorizontal, Eye, Truck, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const orders = [
  {
    id: "#ORD-9541",
    customer: "Ahmed Mohamed",
    date: "Oct 24, 2023",
    total: 450,
    status: "Delivered",
    payment: "Paid",
  },
  {
    id: "#ORD-9542",
    customer: "Sara Ahmed",
    date: "Oct 23, 2023",
    total: 120,
    status: "Processing",
    payment: "Pending",
  },
  {
    id: "#ORD-9543",
    customer: "Omar Ali",
    date: "Oct 23, 2023",
    total: 320,
    status: "Shipped",
    payment: "Paid",
  },
  {
    id: "#ORD-9544",
    customer: "Laila Hassan",
    date: "Oct 22, 2023",
    total: 850,
    status: "Cancelled",
    payment: "Refunded",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered": return "bg-emerald-500/10 text-emerald-500";
    case "Processing": return "bg-blue-500/10 text-blue-500";
    case "Shipped": return "bg-violet-500/10 text-violet-500";
    case "Cancelled": return "bg-destructive/10 text-destructive";
    default: return "bg-muted text-muted-foreground";
  }
};

const DashboardOrders = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-playfair tracking-tight">Orders</h1>
            <p className="text-muted-foreground mt-1">Track and manage customer orders and shipments.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-border/50">Export CSV</Button>
            <Button className="bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20">Print Labels</Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="all" className="rounded-lg">All Orders</TabsTrigger>
            <TabsTrigger value="processing" className="rounded-lg">Processing</TabsTrigger>
            <TabsTrigger value="shipped" className="rounded-lg">Shipped</TabsTrigger>
            <TabsTrigger value="delivered" className="rounded-lg">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled" className="rounded-lg">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="glass-card border-border/50">
          <CardHeader>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by order ID or customer..." className="pl-10 bg-muted/50 border-none" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground text-sm">
                    <th className="pb-4 font-medium">Order ID</th>
                    <th className="pb-4 font-medium">Customer</th>
                    <th className="pb-4 font-medium">Date</th>
                    <th className="pb-4 font-medium">Total</th>
                    <th className="pb-4 font-medium">Payment</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {orders.map((order) => (
                    <tr key={order.id} className="group hover:bg-muted/30 transition-colors">
                      <td className="py-4 font-bold text-sm text-accent">{order.id}</td>
                      <td className="py-4 text-sm font-medium">{order.customer}</td>
                      <td className="py-4 text-sm text-muted-foreground">{order.date}</td>
                      <td className="py-4 text-sm font-bold">${order.total}</td>
                      <td className="py-4">
                        <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider">{order.payment}</Badge>
                      </td>
                      <td className="py-4">
                        <Badge variant="secondary" className={getStatusColor(order.status) + " border-none"}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" title="View Details"><Eye className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" title="Update Status"><Truck className="w-4 h-4 text-accent" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardOrders;
