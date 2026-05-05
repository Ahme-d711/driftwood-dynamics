import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Truck, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardManagementService } from "@/api/dashboard-management.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const getStatusColor = (status: string) => {
  switch (status) {
    case "DELIVERED": return "bg-emerald-500/10 text-emerald-500";
    case "PROCESSING": return "bg-blue-500/10 text-blue-500";
    case "SHIPPED": return "bg-violet-500/10 text-violet-500";
    case "CANCELLED": return "bg-destructive/10 text-destructive";
    default: return "bg-muted text-muted-foreground";
  }
};

const DashboardOrders = () => {
  const [search, setSearch] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [status, setStatus] = useState("PENDING");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-orders", search],
    queryFn: () => dashboardManagementService.getOrders({ search, limit: 50 }),
  });
  const orders = data?.data?.orders ?? [];

  const selectedOrderQuery = useQuery({
    queryKey: ["dashboard-order", selectedOrderId],
    queryFn: () => dashboardManagementService.getOrderById(selectedOrderId as string),
    enabled: !!selectedOrderId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) =>
      dashboardManagementService.updateOrderStatus(id, value),
    onSuccess: () => {
      setEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["dashboard-orders"] });
      if (selectedOrderId) {
        queryClient.invalidateQueries({ queryKey: ["dashboard-order", selectedOrderId] });
      }
    },
  });

  const openViewDialog = (id: string) => {
    setSelectedOrderId(id);
    setViewOpen(true);
  };

  const openEditDialog = (id: string, currentStatus: string) => {
    setSelectedOrderId(id);
    setStatus(currentStatus);
    setEditOpen(true);
  };

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
              <Input
                placeholder="Search by order ID or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-muted/50 border-none"
              />
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
                  {isLoading && (
                    <tr>
                      <td colSpan={7} className="py-10 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-accent" />
                      </td>
                    </tr>
                  )}
                  {isError && (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-sm text-destructive">
                        Failed to load orders.
                      </td>
                    </tr>
                  )}
                  {!isLoading && !isError && orders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                        No orders found.
                      </td>
                    </tr>
                  )}
                  {orders.map((order) => (
                    <tr key={order._id} className="group hover:bg-muted/30 transition-colors">
                      <td className="py-4 font-bold text-sm text-accent">{order.trackingNumber ?? order._id.slice(-8)}</td>
                      <td className="py-4 text-sm font-medium">{order.recipientName}</td>
                      <td className="py-4 text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 text-sm font-bold">${order.totalAmount.toFixed(2)}</td>
                      <td className="py-4">
                        <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider">{order.paymentStatus}</Badge>
                      </td>
                      <td className="py-4">
                        <Badge variant="secondary" className={`${getStatusColor(order.status)} border-none`}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" title="View Details" onClick={() => openViewDialog(order._id)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Update Status" onClick={() => openEditDialog(order._id, order.status)}>
                            <Truck className="w-4 h-4 text-accent" />
                          </Button>
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

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>View complete order information.</DialogDescription>
          </DialogHeader>
          {selectedOrderQuery.isLoading ? (
            <div className="py-6 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-accent" /></div>
          ) : (
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Tracking:</span> {selectedOrderQuery.data?.data.order.trackingNumber ?? "-"}</p>
              <p><span className="font-semibold">Recipient:</span> {selectedOrderQuery.data?.data.order.recipientName}</p>
              <p><span className="font-semibold">Total:</span> ${selectedOrderQuery.data?.data.order.totalAmount.toFixed(2)}</p>
              <p><span className="font-semibold">Payment:</span> {selectedOrderQuery.data?.data.order.paymentStatus}</p>
              <p><span className="font-semibold">Status:</span> {selectedOrderQuery.data?.data.order.status}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Order Status</DialogTitle>
            <DialogDescription>Update order workflow state.</DialogDescription>
          </DialogHeader>
          <Input value={status} onChange={(e) => setStatus(e.target.value.toUpperCase())} />
          <DialogFooter>
            <Button
              onClick={() => selectedOrderId && updateStatusMutation.mutate({ id: selectedOrderId, value: status })}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? "Saving..." : "Save Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default DashboardOrders;
