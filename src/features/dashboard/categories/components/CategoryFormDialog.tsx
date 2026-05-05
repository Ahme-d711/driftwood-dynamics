import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CategoryFormState } from "./categories.types";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  form: CategoryFormState;
  setForm: Dispatch<SetStateAction<CategoryFormState>>;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: () => void;
  onImageChange?: (file: File | null) => void;
  minimal?: boolean;
}

export const CategoryFormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  form,
  setForm,
  isSubmitting,
  submitLabel,
  onSubmit,
  onImageChange,
  minimal = false,
}: CategoryFormDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="grid gap-3">
        <Label>Name (EN)</Label>
        <Input value={form.nameEn} onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))} />
        <Label>Name (AR)</Label>
        <Input value={form.nameAr} onChange={(e) => setForm((p) => ({ ...p, nameAr: e.target.value }))} />
        {!minimal && (
          <>
            <Label>Description (EN)</Label>
            <Textarea value={form.descriptionEn} onChange={(e) => setForm((p) => ({ ...p, descriptionEn: e.target.value }))} />
            <Label>Description (AR)</Label>
            <Textarea value={form.descriptionAr} onChange={(e) => setForm((p) => ({ ...p, descriptionAr: e.target.value }))} />
            <Label>Category Image</Label>
            <Input type="file" accept="image/*" onChange={(e) => onImageChange?.(e.target.files?.[0] ?? null)} />
          </>
        )}
      </div>
      <DialogFooter>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
