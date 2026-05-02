import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const products = [
  {
    id: "1",
    name: "Luxury Diamond Ring",
    category: "Jewelry",
    price: 1200,
    stock: 12,
    status: "Active",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    name: "Classic Watch Gold",
    category: "Accessories",
    price: 850,
    stock: 5,
    status: "Active",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    name: "Silk Evening Gown",
    category: "Fashion",
    price: 2400,
    stock: 0,
    status: "Out of Stock",
    image: "https://images.unsplash.com/photo-1539008835279-43469382e8cc?w=100&h=100&fit=crop",
  },
];

const DashboardProducts = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-playfair tracking-tight">Products Management</h1>
            <p className="text-muted-foreground mt-1">Manage your catalog, stock, and pricing.</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        <Card className="glass-card border-border/50">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search products..." className="pl-10 bg-muted/50 border-none" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-border/50">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="border-border/50">
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground text-sm">
                    <th className="pb-4 font-medium">Product</th>
                    <th className="pb-4 font-medium">Category</th>
                    <th className="pb-4 font-medium">Price</th>
                    <th className="pb-4 font-medium">Stock</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {products.map((product) => (
                    <tr key={product.id} className="group hover:bg-muted/30 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-crop" />
                          <span className="font-medium text-sm">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-muted-foreground">{product.category}</td>
                      <td className="py-4 text-sm font-bold">${product.price.toLocaleString()}</td>
                      <td className="py-4 text-sm text-muted-foreground">{product.stock} units</td>
                      <td className="py-4">
                        <Badge variant="secondary" className={product.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"}>
                          {product.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> View</DropdownMenuItem>
                            <DropdownMenuItem><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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

export default DashboardProducts;
