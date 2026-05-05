import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, ChevronRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const DashboardCategories = () => {
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    nameEn: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
    priority: 0,
    isShow: true,
  });
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-categories", search],
    queryFn: () => dashboardManagementService.getCategories({ search, limit: 30 }),
  });

  const selectedCategoryQuery = useQuery({
    queryKey: ["dashboard-category", selectedCategoryId],
    queryFn: () => dashboardManagementService.getCategoryById(selectedCategoryId as string),
    enabled: !!selectedCategoryId,
  });

  const createCategoryMutation = useMutation({
    mutationFn: (payload: FormData) => dashboardManagementService.createCategory(payload),
    onSuccess: () => {
      setAddOpen(false);
      setImageFile(null);
      setForm({
        nameEn: "",
        nameAr: "",
        descriptionEn: "",
        descriptionAr: "",
        priority: 0,
        isShow: true,
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard-categories"] });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
      dashboardManagementService.updateCategory(id, payload),
    onSuccess: () => {
      setEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["dashboard-categories"] });
      if (selectedCategoryId) {
        queryClient.invalidateQueries({ queryKey: ["dashboard-category", selectedCategoryId] });
      }
    },
  });

  const categories = data?.data?.categories ?? [];

  const openViewDialog = (id: string) => {
    setSelectedCategoryId(id);
    setViewOpen(true);
  };

  const openEditDialog = (id: string) => {
    const current = categories.find((c) => c._id === id);
    if (current) {
      setForm({
        nameEn: current.nameEn ?? "",
        nameAr: current.nameAr ?? "",
        descriptionEn: current.descriptionEn ?? "",
        descriptionAr: current.descriptionAr ?? "",
        priority: current.priority ?? 0,
        isShow: current.isShow ?? true,
      });
    }
    setSelectedCategoryId(id);
    setEditOpen(true);
  };

  const submitCreateCategory = () => {
    const payload = new FormData();
    payload.append("nameEn", form.nameEn);
    payload.append("nameAr", form.nameAr);
    payload.append("descriptionEn", form.descriptionEn);
    payload.append("descriptionAr", form.descriptionAr);
    payload.append("priority", String(form.priority));
    payload.append("isShow", String(form.isShow));
    if (imageFile) payload.append("image", imageFile);
    createCategoryMutation.mutate(payload);
  };

  const submitUpdateCategory = () => {
    if (!selectedCategoryId) return;
    const payload = new FormData();
    payload.append("nameEn", form.nameEn);
    payload.append("nameAr", form.nameAr);
    payload.append("descriptionEn", form.descriptionEn);
    payload.append("descriptionAr", form.descriptionAr);
    payload.append("priority", String(form.priority));
    payload.append("isShow", String(form.isShow));
    if (imageFile) payload.append("image", imageFile);
    updateCategoryMutation.mutate({ id: selectedCategoryId, payload });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-playfair tracking-tight">Categories</h1>
            <p className="text-muted-foreground mt-1">Organize your products with categories and subcategories.</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20" onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </Button>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-muted/50 border-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && (
            <Card className="glass-card border-border/50">
              <CardContent className="p-10 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
              </CardContent>
            </Card>
          )}
          {isError && (
            <Card className="glass-card border-border/50">
              <CardContent className="p-10 text-sm text-destructive">Failed to load categories.</CardContent>
            </Card>
          )}
          {categories.map((category) => (
            <Card key={category._id} className="glass-card border-border/50 group hover:border-accent/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <img src={category.image} alt={category.nameEn} className="w-16 h-16 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform" />
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent" onClick={() => openEditDialog(category._id)}>
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
                      <p className="text-lg font-bold">{category.productsCount ?? 0}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Sub-cats</p>
                      <p className="text-lg font-bold">{category.subcategoriesCount ?? 0}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full bg-muted group-hover:bg-accent group-hover:text-white transition-colors" onClick={() => openViewDialog(category._id)}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {!isLoading && !isError && categories.length === 0 && (
            <Card className="glass-card border-border/50">
              <CardContent className="p-10 text-sm text-muted-foreground">No categories found.</CardContent>
            </Card>
          )}
          <button onClick={() => setAddOpen(true)} className="border-2 border-dashed border-border/50 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-accent hover:border-accent/30 transition-all group h-[260px]">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-medium">Add New Category</span>
          </button>
        </div>
      </div>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Category Details</DialogTitle>
            <DialogDescription>View category details from backend.</DialogDescription>
          </DialogHeader>
          {selectedCategoryQuery.isLoading ? (
            <div className="py-6 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-accent" /></div>
          ) : (
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">English Name:</span> {selectedCategoryQuery.data?.data.category.nameEn}</p>
              <p><span className="font-semibold">Arabic Name:</span> {selectedCategoryQuery.data?.data.category.nameAr}</p>
              <p><span className="font-semibold">Description EN:</span> {selectedCategoryQuery.data?.data.category.descriptionEn ?? "-"}</p>
              <p><span className="font-semibold">Description AR:</span> {selectedCategoryQuery.data?.data.category.descriptionAr ?? "-"}</p>
              <p><span className="font-semibold">Status:</span> {selectedCategoryQuery.data?.data.category.isShow ? "Active" : "Hidden"}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>Create a new category.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Label>Name (EN)</Label>
            <Input value={form.nameEn} onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))} />
            <Label>Name (AR)</Label>
            <Input value={form.nameAr} onChange={(e) => setForm((p) => ({ ...p, nameAr: e.target.value }))} />
            <Label>Description (EN)</Label>
            <Textarea value={form.descriptionEn} onChange={(e) => setForm((p) => ({ ...p, descriptionEn: e.target.value }))} />
            <Label>Description (AR)</Label>
            <Textarea value={form.descriptionAr} onChange={(e) => setForm((p) => ({ ...p, descriptionAr: e.target.value }))} />
            <Label>Priority</Label>
            <Input type="number" value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: Number(e.target.value) }))} />
            <Label>Show Category</Label>
            <Input type="checkbox" checked={form.isShow} onChange={(e) => setForm((p) => ({ ...p, isShow: e.target.checked }))} />
            <Label>Category Image</Label>
            <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
          </div>
          <DialogFooter>
            <Button onClick={submitCreateCategory} disabled={createCategoryMutation.isPending}>
              {createCategoryMutation.isPending ? "Saving..." : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update selected category.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Label>Name (EN)</Label>
            <Input value={form.nameEn} onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))} />
            <Label>Name (AR)</Label>
            <Input value={form.nameAr} onChange={(e) => setForm((p) => ({ ...p, nameAr: e.target.value }))} />
            <Label>Description (EN)</Label>
            <Textarea value={form.descriptionEn} onChange={(e) => setForm((p) => ({ ...p, descriptionEn: e.target.value }))} />
            <Label>Description (AR)</Label>
            <Textarea value={form.descriptionAr} onChange={(e) => setForm((p) => ({ ...p, descriptionAr: e.target.value }))} />
            <Label>Priority</Label>
            <Input type="number" value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: Number(e.target.value) }))} />
            <Label>Show Category</Label>
            <Input type="checkbox" checked={form.isShow} onChange={(e) => setForm((p) => ({ ...p, isShow: e.target.checked }))} />
            <Label>Category Image</Label>
            <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
          </div>
          <DialogFooter>
            <Button onClick={submitUpdateCategory} disabled={updateCategoryMutation.isPending}>
              {updateCategoryMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default DashboardCategories;
