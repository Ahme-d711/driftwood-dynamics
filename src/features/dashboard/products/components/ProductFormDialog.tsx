import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CategoryListItem } from "@/api/dashboard-management.service";
import { ProductFormState } from "./products.types";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  form: ProductFormState;
  setForm: Dispatch<SetStateAction<ProductFormState>>;
  categories: CategoryListItem[];
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: () => void;
  onMainImageChange: (file: File | null) => void;
  onGalleryChange: (files: File[]) => void;
  showCategoryField: boolean;
  showMainImageField: boolean;
}

export const ProductFormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  form,
  setForm,
  categories,
  isSubmitting,
  submitLabel,
  onSubmit,
  onMainImageChange,
  onGalleryChange,
  showCategoryField,
  showMainImageField,
}: ProductFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
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
          <Input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm((p) => ({ ...p, isBestSeller: e.target.checked }))} />
          <Label>In Stock</Label>
          <Input type="checkbox" checked={form.inStock} onChange={(e) => setForm((p) => ({ ...p, inStock: e.target.checked }))} />
          <Label>Battery Life</Label>
          <Input value={form.batteryLife} onChange={(e) => setForm((p) => ({ ...p, batteryLife: e.target.value }))} placeholder="30h" />
          <Label>Noise Cancelling</Label>
          <Input type="checkbox" checked={form.noiseCancelling} onChange={(e) => setForm((p) => ({ ...p, noiseCancelling: e.target.checked }))} />
          <Label>Audio Features (comma separated)</Label>
          <Input value={form.audioFeatures} onChange={(e) => setForm((p) => ({ ...p, audioFeatures: e.target.value }))} placeholder="Adaptive EQ, Spatial Audio" />
          <Label>Free Shipping</Label>
          <Input type="checkbox" checked={form.freeShipping} onChange={(e) => setForm((p) => ({ ...p, freeShipping: e.target.checked }))} />
          <Label>Shipping Condition</Label>
          <Input value={form.shippingCondition} onChange={(e) => setForm((p) => ({ ...p, shippingCondition: e.target.value }))} placeholder="Orders over $50" />
          <Label>Warranty</Label>
          <Input value={form.warranty} onChange={(e) => setForm((p) => ({ ...p, warranty: e.target.value }))} placeholder="2 years" />
          <Label>Returns</Label>
          <Input value={form.returns} onChange={(e) => setForm((p) => ({ ...p, returns: e.target.value }))} placeholder="30 days" />
          {showCategoryField && (
            <>
              <Label>Category Id</Label>
              <Input value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))} list="categories-list" />
              <datalist id="categories-list">
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.nameEn}
                  </option>
                ))}
              </datalist>
            </>
          )}
          {showMainImageField && (
            <>
              <Label>Main Image</Label>
              <Input type="file" accept="image/*" onChange={(e) => onMainImageChange(e.target.files?.[0] ?? null)} />
            </>
          )}
          <Label>Gallery Images</Label>
          <Input type="file" accept="image/*" multiple onChange={(e) => onGalleryChange(Array.from(e.target.files ?? []))} />
        </div>
        <DialogFooter>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
