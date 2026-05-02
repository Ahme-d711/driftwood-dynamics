import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Layers, Edit, Trash2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    id: "1",
    nameEn: "Jewelry",
    nameAr: "مجوهرات",
    subCount: 8,
    productCount: 142,
    status: "Active",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    nameEn: "Fashion",
    nameAr: "أزياء",
    subCount: 12,
    productCount: 325,
    status: "Active",
    image: "https://images.unsplash.com/photo-1445205170230-053b83e2638c?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    nameEn: "Accessories",
    nameAr: "إكسسوارات",
    subCount: 5,
    productCount: 89,
    status: "Active",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
  },
];

const DashboardCategories = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-playfair tracking-tight">Categories</h1>
            <p className="text-muted-foreground mt-1">Organize your products with categories and subcategories.</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20">
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="glass-card border-border/50 group hover:border-accent/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <img src={category.image} alt={category.nameEn} className="w-16 h-16 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform" />
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold font-playfair">{category.nameEn}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{category.nameAr}</p>
                  
                  <div className="flex items-center gap-4 mt-6">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Products</p>
                      <p className="text-lg font-bold">{category.productCount}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Sub-cats</p>
                      <p className="text-lg font-bold">{category.subCount}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full bg-muted group-hover:bg-accent group-hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <button className="border-2 border-dashed border-border/50 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-accent hover:border-accent/30 transition-all group h-[260px]">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-medium">Add New Category</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardCategories;
