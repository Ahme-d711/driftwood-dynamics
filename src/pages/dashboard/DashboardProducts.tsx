import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardManagementService } from "@/api/dashboard-management.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const DashboardProducts = () => {
  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [form, setForm] = useState({
    name: "",
    nameEn: "",
    nameAr: "",
    description: "",
    descriptionEn: "",
    descriptionAr: "",
    price: 0,
    originalPrice: 0,
    oldPrice: 0,
    stock: 0,
    rating: 0,
    reviews: 0,
    badge: "",
    inStock: true,
    isBestSeller: false,
    batteryLife: "",
    noiseCancelling: false,
    audioFeatures: "",
    freeShipping: false,
    shippingCondition: "",
    warranty: "",
    returns: "",
    categoryId: "",
    isShow: true,
  });
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-products", search],
    queryFn: () => dashboardManagementService.getProducts({ search, limit: 50 }),
  });
  const categoriesQuery = useQuery({
    queryKey: ["dashboard-product-categories"],
    queryFn: () => dashboardManagementService.getCategories({ limit: 50 }),
  });
  const selectedProductQuery = useQuery({
    queryKey: ["dashboard-product", selectedProductId],
    queryFn: () => dashboardManagementService.getProductById(selectedProductId as string),
    enabled: !!selectedProductId,
  });
  const createProductMutation = useMutation({
    mutationFn: (payload: FormData) => dashboardManagementService.createProduct(payload),
    onSuccess: () => {
      setAddOpen(false);
      queryClient.invalidateQueries({ queryKey: ["dashboard-products"] });
    },
  });
  const updateProductMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
      dashboardManagementService.updateProduct(id, payload),
    onSuccess: () => {
      setEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["dashboard-products"] });
      if (selectedProductId) {
        queryClient.invalidateQueries({ queryKey: ["dashboard-product", selectedProductId] });
      }
    },
  });

  const products = data?.data?.products ?? [];
  const categories = categoriesQuery.data?.data?.categories ?? [];

  const openViewDialog = (id: string) => {
    setSelectedProductId(id);
    setViewOpen(true);
  };

  const openEditDialog = (id: string) => {
    const current = products.find((p) => p._id === id);
    if (current) {
      setForm({
        name: current.nameEn,
        nameEn: current.nameEn,
        nameAr: current.nameAr,
        description: "",
        descriptionEn: "",
        descriptionAr: "",
        price: current.price,
        originalPrice: 0,
        oldPrice: 0,
        stock: current.stock,
        rating: 0,
        reviews: 0,
        badge: "",
        inStock: current.stock > 0,
        isBestSeller: false,
        batteryLife: "",
        noiseCancelling: false,
        audioFeatures: "",
        freeShipping: false,
        shippingCondition: "",
        warranty: "",
        returns: "",
        categoryId: current.categoryId?._id ?? "",
        isShow: current.isShow,
      });
    }
    setSelectedProductId(id);
    setEditOpen(true);
  };

  const submitAddProduct = () => {
    if (!mainImageFile) return;
    const galleryNames = galleryFiles.map((file) => file.name);
    const discountPercentage =
      form.originalPrice > 0 ? Math.round((1 - form.price / form.originalPrice) * 100) : 0;

    const payload = new FormData();
    payload.append("id", `prod_${Date.now()}`);
    payload.append("name", form.name || form.nameEn);
    payload.append("price", String(form.price));
    payload.append("old_price", String(form.originalPrice));
    payload.append("discount_percentage", String(Math.max(discountPercentage, 0)));
    payload.append("rating", String(form.rating));
    payload.append("reviews_count", String(form.reviews));
    payload.append("stock", String(form.stock));
    payload.append("is_best_seller", String(form.isBestSeller));
    payload.append("warranty", form.warranty);
    payload.append("returns", form.returns);
    payload.append(
      "images",
      JSON.stringify({
        main: mainImageFile.name,
        gallery: galleryNames,
      })
    );
    payload.append(
      "features",
      JSON.stringify({
        battery_life: form.batteryLife,
        noise_cancelling: form.noiseCancelling,
        audio: form.audioFeatures
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      })
    );
    payload.append(
      "shipping",
      JSON.stringify({
        free_shipping: form.freeShipping,
        condition: form.shippingCondition,
      })
    );
    payload.append("mainImage", mainImageFile);
    galleryFiles.forEach((file) => payload.append("images", file));
    createProductMutation.mutate(payload);
  };

  const submitEditProduct = () => {
    if (!selectedProductId) return;
    const payload = new FormData();
    payload.append("id", `prod_${selectedProductId}`);
    payload.append("name", form.name || form.nameEn);
    payload.append("price", String(form.price));
    payload.append("old_price", String(form.originalPrice));
    payload.append(
      "discount_percentage",
      String(form.originalPrice > 0 ? Math.max(Math.round((1 - form.price / form.originalPrice) * 100), 0) : 0)
    );
    payload.append("stock", String(form.stock));
    payload.append("rating", String(form.rating));
    payload.append("reviews_count", String(form.reviews));
    payload.append("is_best_seller", String(form.isBestSeller));
    payload.append("warranty", form.warranty);
    payload.append("returns", form.returns);
    payload.append(
      "features",
      JSON.stringify({
        battery_life: form.batteryLife,
        noise_cancelling: form.noiseCancelling,
        audio: form.audioFeatures
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      })
    );
    payload.append(
      "shipping",
      JSON.stringify({
        free_shipping: form.freeShipping,
        condition: form.shippingCondition,
      })
    );
    if (mainImageFile) {
      payload.append("mainImage", mainImageFile);
    }
    galleryFiles.forEach((file) => payload.append("images", file));
    updateProductMutation.mutate({ id: selectedProductId, payload });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-playfair tracking-tight">Products Management</h1>
            <p className="text-muted-foreground mt-1">Manage your catalog, stock, and pricing.</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20" onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        <Card className="glass-card border-border/50">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-muted/50 border-none"
                />
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
                  {isLoading && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-accent" />
                      </td>
                    </tr>
                  )}
                  {isError && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-sm text-destructive">
                        Failed to load products.
                      </td>
                    </tr>
                  )}
                  {!isLoading && !isError && products.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                        No products found.
                      </td>
                    </tr>
                  )}
                  {products.map((product) => (
                    <tr key={product._id} className="group hover:bg-muted/30 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.mainImage} alt={product.nameEn} className="w-10 h-10 rounded-lg object-cover" />
                          <span className="font-medium text-sm">{product.nameEn}</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-muted-foreground">{product.categoryId?.nameEn ?? "-"}</td>
                      <td className="py-4 text-sm font-bold">${product.price.toLocaleString()}</td>
                      <td className="py-4 text-sm text-muted-foreground">{product.stock} units</td>
                      <td className="py-4">
                        <Badge variant="secondary" className={product.isShow ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"}>
                          {product.isShow ? "Active" : "Hidden"}
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
                            <DropdownMenuItem onClick={() => openViewDialog(product._id)}>
                              <Eye className="w-4 h-4 mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditDialog(product._id)}>
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
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

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>View full product info from backend.</DialogDescription>
          </DialogHeader>
          {selectedProductQuery.isLoading ? (
            <div className="py-6 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-accent" /></div>
          ) : (
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Name:</span> {selectedProductQuery.data?.data.product.nameEn}</p>
              <p><span className="font-semibold">Arabic Name:</span> {selectedProductQuery.data?.data.product.nameAr}</p>
              <p><span className="font-semibold">Price:</span> ${selectedProductQuery.data?.data.product.price}</p>
              <p><span className="font-semibold">Stock:</span> {selectedProductQuery.data?.data.product.stock}</p>
              <p><span className="font-semibold">Status:</span> {selectedProductQuery.data?.data.product.isShow ? "Active" : "Hidden"}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>Create a product from dashboard table.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Label>Name (Product Details)</Label>
            <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            <Label>Name (EN)</Label>
            <Input value={form.nameEn} onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))} />
            <Label>Name (AR)</Label>
            <Input value={form.nameAr} onChange={(e) => setForm((p) => ({ ...p, nameAr: e.target.value }))} />
            <Label>Description (Product Details)</Label>
            <Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            <Label>Description (EN)</Label>
            <Textarea value={form.descriptionEn} onChange={(e) => setForm((p) => ({ ...p, descriptionEn: e.target.value }))} />
            <Label>Description (AR)</Label>
            <Textarea value={form.descriptionAr} onChange={(e) => setForm((p) => ({ ...p, descriptionAr: e.target.value }))} />
            <Label>Price</Label>
            <Input type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))} />
            <Label>Original Price</Label>
            <Input type="number" value={form.originalPrice} onChange={(e) => setForm((p) => ({ ...p, originalPrice: Number(e.target.value) }))} />
            <Label>Stock</Label>
            <Input type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))} />
            <Label>Rating</Label>
            <Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm((p) => ({ ...p, rating: Number(e.target.value) }))} />
            <Label>Reviews Count</Label>
            <Input type="number" min="0" value={form.reviews} onChange={(e) => setForm((p) => ({ ...p, reviews: Number(e.target.value) }))} />
            <Label>Badge</Label>
            <Input value={form.badge} onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))} placeholder="Best Seller" />
            <Label>Best Seller</Label>
            <Input
              type="checkbox"
              checked={form.isBestSeller}
              onChange={(e) => setForm((p) => ({ ...p, isBestSeller: e.target.checked }))}
            />
            <Label>In Stock</Label>
            <Input type="checkbox" checked={form.inStock} onChange={(e) => setForm((p) => ({ ...p, inStock: e.target.checked }))} />
            <Label>Battery Life</Label>
            <Input value={form.batteryLife} onChange={(e) => setForm((p) => ({ ...p, batteryLife: e.target.value }))} placeholder="30h" />
            <Label>Noise Cancelling</Label>
            <Input
              type="checkbox"
              checked={form.noiseCancelling}
              onChange={(e) => setForm((p) => ({ ...p, noiseCancelling: e.target.checked }))}
            />
            <Label>Audio Features (comma separated)</Label>
            <Input value={form.audioFeatures} onChange={(e) => setForm((p) => ({ ...p, audioFeatures: e.target.value }))} placeholder="Adaptive EQ, Spatial Audio" />
            <Label>Free Shipping</Label>
            <Input
              type="checkbox"
              checked={form.freeShipping}
              onChange={(e) => setForm((p) => ({ ...p, freeShipping: e.target.checked }))}
            />
            <Label>Shipping Condition</Label>
            <Input value={form.shippingCondition} onChange={(e) => setForm((p) => ({ ...p, shippingCondition: e.target.value }))} placeholder="Orders over $50" />
            <Label>Warranty</Label>
            <Input value={form.warranty} onChange={(e) => setForm((p) => ({ ...p, warranty: e.target.value }))} placeholder="2 years" />
            <Label>Returns</Label>
            <Input value={form.returns} onChange={(e) => setForm((p) => ({ ...p, returns: e.target.value }))} placeholder="30 days" />
            <Label>Category Id</Label>
            <Input value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))} list="categories-list" />
            <datalist id="categories-list">
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.nameEn}
                </option>
              ))}
            </datalist>
            <Label>Main Image</Label>
            <Input type="file" accept="image/*" onChange={(e) => setMainImageFile(e.target.files?.[0] ?? null)} />
            <Label>Gallery Images</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setGalleryFiles(Array.from(e.target.files ?? []))}
            />
          </div>
          <DialogFooter>
            <Button onClick={submitAddProduct} disabled={createProductMutation.isPending}>
              {createProductMutation.isPending ? "Saving..." : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update key product fields.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Label>Name (Product Details)</Label>
            <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            <Label>Name (EN)</Label>
            <Input value={form.nameEn} onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))} />
            <Label>Name (AR)</Label>
            <Input value={form.nameAr} onChange={(e) => setForm((p) => ({ ...p, nameAr: e.target.value }))} />
            <Label>Description (Product Details)</Label>
            <Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            <Label>Description (EN)</Label>
            <Textarea value={form.descriptionEn} onChange={(e) => setForm((p) => ({ ...p, descriptionEn: e.target.value }))} />
            <Label>Description (AR)</Label>
            <Textarea value={form.descriptionAr} onChange={(e) => setForm((p) => ({ ...p, descriptionAr: e.target.value }))} />
            <Label>Price</Label>
            <Input type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))} />
            <Label>Original Price</Label>
            <Input type="number" value={form.originalPrice} onChange={(e) => setForm((p) => ({ ...p, originalPrice: Number(e.target.value) }))} />
            <Label>Stock</Label>
            <Input type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))} />
            <Label>Rating</Label>
            <Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm((p) => ({ ...p, rating: Number(e.target.value) }))} />
            <Label>Reviews Count</Label>
            <Input type="number" min="0" value={form.reviews} onChange={(e) => setForm((p) => ({ ...p, reviews: Number(e.target.value) }))} />
            <Label>Badge</Label>
            <Input value={form.badge} onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))} placeholder="Best Seller" />
            <Label>Best Seller</Label>
            <Input
              type="checkbox"
              checked={form.isBestSeller}
              onChange={(e) => setForm((p) => ({ ...p, isBestSeller: e.target.checked }))}
            />
            <Label>In Stock</Label>
            <Input type="checkbox" checked={form.inStock} onChange={(e) => setForm((p) => ({ ...p, inStock: e.target.checked }))} />
            <Label>Battery Life</Label>
            <Input value={form.batteryLife} onChange={(e) => setForm((p) => ({ ...p, batteryLife: e.target.value }))} placeholder="30h" />
            <Label>Noise Cancelling</Label>
            <Input
              type="checkbox"
              checked={form.noiseCancelling}
              onChange={(e) => setForm((p) => ({ ...p, noiseCancelling: e.target.checked }))}
            />
            <Label>Audio Features (comma separated)</Label>
            <Input value={form.audioFeatures} onChange={(e) => setForm((p) => ({ ...p, audioFeatures: e.target.value }))} placeholder="Adaptive EQ, Spatial Audio" />
            <Label>Free Shipping</Label>
            <Input
              type="checkbox"
              checked={form.freeShipping}
              onChange={(e) => setForm((p) => ({ ...p, freeShipping: e.target.checked }))}
            />
            <Label>Shipping Condition</Label>
            <Input value={form.shippingCondition} onChange={(e) => setForm((p) => ({ ...p, shippingCondition: e.target.value }))} placeholder="Orders over $50" />
            <Label>Warranty</Label>
            <Input value={form.warranty} onChange={(e) => setForm((p) => ({ ...p, warranty: e.target.value }))} placeholder="2 years" />
            <Label>Returns</Label>
            <Input value={form.returns} onChange={(e) => setForm((p) => ({ ...p, returns: e.target.value }))} placeholder="30 days" />
            <Label>Gallery Images</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setGalleryFiles(Array.from(e.target.files ?? []))}
            />
          </div>
          <DialogFooter>
            <Button onClick={submitEditProduct} disabled={updateProductMutation.isPending}>
              {updateProductMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default DashboardProducts;
