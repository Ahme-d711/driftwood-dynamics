import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Globe, Bell, Shield, Wallet, Loader2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { dashboardManagementService } from "@/api/dashboard-management.service";

export const SettingsPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-settings"],
    queryFn: () => dashboardManagementService.getSettings(),
  });
  const [form, setForm] = useState({
    contactEmail: "",
    contactPhone: "",
    shippingCost: 0,
    taxRate: 0,
    freeShippingThreshold: 0,
    currency: "EGP",
  });
  useEffect(() => {
    if (!data?.data) return;
    setForm({
      contactEmail: data.data.contactEmail ?? "",
      contactPhone: data.data.contactPhone ?? "",
      shippingCost: data.data.shippingCost ?? 0,
      taxRate: data.data.taxRate ?? 0,
      freeShippingThreshold: data.data.freeShippingThreshold ?? 0,
      currency: data.data.currency ?? "EGP",
    });
  }, [data]);
  const updateMutation = useMutation({ mutationFn: () => dashboardManagementService.updateSettings(form) });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-playfair tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">Configure your store's general settings and preferences.</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20" onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />{updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
        {isLoading && <div className="py-6 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>}
        {isError && <p className="text-sm text-destructive">Failed to load settings.</p>}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-muted/50 p-1 rounded-xl w-full justify-start overflow-x-auto">
            <TabsTrigger value="general" className="rounded-lg gap-2"><Globe className="w-4 h-4" /> General</TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-lg gap-2"><Bell className="w-4 h-4" /> Notifications</TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg gap-2"><Shield className="w-4 h-4" /> Security</TabsTrigger>
            <TabsTrigger value="payments" className="rounded-lg gap-2"><Wallet className="w-4 h-4" /> Payments</TabsTrigger>
          </TabsList>
          <div className="mt-6 space-y-6">
            <TabsContent value="general" className="space-y-6">
              <Card className="glass-card border-border/50">
                <CardHeader><CardTitle className="text-lg">Store Information</CardTitle><CardDescription>Basic details about your online store.</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="store-email">Contact Email</Label><Input id="store-email" value={form.contactEmail} onChange={(e) => setForm((prev) => ({ ...prev, contactEmail: e.target.value }))} className="bg-muted/30" /></div>
                    <div className="space-y-2"><Label htmlFor="store-phone">Contact Phone</Label><Input id="store-phone" value={form.contactPhone} onChange={(e) => setForm((prev) => ({ ...prev, contactPhone: e.target.value }))} className="bg-muted/30" /></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-border/50">
                <CardHeader><CardTitle className="text-lg">Localization</CardTitle><CardDescription>Default language and currency settings.</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="tax-rate">Tax Rate (%)</Label><Input id="tax-rate" type="number" value={form.taxRate} onChange={(e) => setForm((prev) => ({ ...prev, taxRate: Number(e.target.value) }))} className="bg-muted/30" /></div>
                    <div className="space-y-2"><Label htmlFor="shipping-cost">Shipping Cost</Label><Input id="shipping-cost" type="number" value={form.shippingCost} onChange={(e) => setForm((prev) => ({ ...prev, shippingCost: Number(e.target.value) }))} className="bg-muted/30" /></div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications"><Card className="glass-card border-border/50"><CardHeader><CardTitle className="text-lg">Email Notifications</CardTitle></CardHeader><CardContent className="space-y-6"><div className="flex items-center justify-between"><Label>New Order Alert</Label><Switch defaultChecked /></div></CardContent></Card></TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
