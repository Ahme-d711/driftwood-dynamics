import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Globe, Bell, Shield, Wallet } from "lucide-react";

const DashboardSettings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-playfair tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">Configure your store's general settings and preferences.</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

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
                <CardHeader>
                  <CardTitle className="text-lg">Store Information</CardTitle>
                  <CardDescription>Basic details about your online store.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="store-name">Store Name</Label>
                      <Input id="store-name" defaultValue="ZAHA Luxury" className="bg-muted/30" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-email">Contact Email</Label>
                      <Input id="store-email" defaultValue="info@zaha.com" className="bg-muted/30" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-desc">Store Description</Label>
                    <Input id="store-desc" defaultValue="The ultimate luxury shopping experience." className="bg-muted/30" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Localization</CardTitle>
                  <CardDescription>Default language and currency settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primary Language</Label>
                      <Button variant="outline" className="w-full justify-between border-border/50">
                        Arabic (Egypt)
                        <Globe className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Button variant="outline" className="w-full justify-between border-border/50">
                        EGP (£)
                        <Wallet className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Email Notifications</CardTitle>
                  <CardDescription>Control which emails you and your customers receive.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Order Alert</Label>
                      <p className="text-sm text-muted-foreground">Receive an email when a new order is placed.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Low Stock Warning</Label>
                      <p className="text-sm text-muted-foreground">Get notified when product stock drops below 5 units.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Customer Reviews</Label>
                      <p className="text-sm text-muted-foreground">Notify me when a new product review is posted.</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DashboardSettings;
