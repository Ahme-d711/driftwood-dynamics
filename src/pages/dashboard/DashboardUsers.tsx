import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, Filter, MoreHorizontal, UserCheck, UserX, Mail, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { useQueryClient } from "@tanstack/react-query";

const DashboardUsers = () => {
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
    isActive: true,
  });
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-users", search],
    queryFn: () => dashboardManagementService.getUsers({ search, limit: 50 }),
  });
  const users = data?.data?.users ?? [];

  const selectedUserQuery = useQuery({
    queryKey: ["dashboard-user", selectedUserId],
    queryFn: () => dashboardManagementService.getUserById(selectedUserId as string),
    enabled: !!selectedUserId,
  });

  const createUserMutation = useMutation({
    mutationFn: (payload: FormData) => dashboardManagementService.createUser(payload),
    onSuccess: () => {
      setAddOpen(false);
      setForm({ name: "", email: "", phone: "", role: "user", isActive: true });
      queryClient.invalidateQueries({ queryKey: ["dashboard-users"] });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
      dashboardManagementService.updateUser(id, payload),
    onSuccess: () => {
      setEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["dashboard-users"] });
      if (selectedUserId) {
        queryClient.invalidateQueries({ queryKey: ["dashboard-user", selectedUserId] });
      }
    },
  });

  const openViewDialog = (id: string) => {
    setSelectedUserId(id);
    setViewOpen(true);
  };

  const openEditDialog = (id: string) => {
    const current = users.find((u) => u._id === id);
    if (current) {
      setForm({
        name: current.name,
        email: current.email,
        phone: current.phone ?? "",
        role: current.role,
        isActive: current.isActive,
      });
    }
    setSelectedUserId(id);
    setEditOpen(true);
  };

  const submitCreateUser = () => {
    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("email", form.email);
    payload.append("phone", form.phone);
    payload.append("role", form.role);
    payload.append("isActive", String(form.isActive));
    createUserMutation.mutate(payload);
  };

  const submitUpdateUser = () => {
    if (!selectedUserId) return;
    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("email", form.email);
    payload.append("phone", form.phone);
    payload.append("role", form.role);
    payload.append("isActive", String(form.isActive));
    updateUserMutation.mutate({ id: selectedUserId, payload });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-playfair tracking-tight">Users Management</h1>
            <p className="text-muted-foreground mt-1">Manage user accounts, roles, and permissions.</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20" onClick={() => setAddOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite User
          </Button>
        </div>

        <Card className="glass-card border-border/50">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-muted/50 border-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-border/50">
                  <Filter className="w-4 h-4 mr-2" />
                  All Roles
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground text-sm">
                    <th className="pb-4 font-medium">User</th>
                    <th className="pb-4 font-medium">Role</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium">Joined Date</th>
                    <th className="pb-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {isLoading && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-accent" />
                      </td>
                    </tr>
                  )}
                  {isError && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-sm text-destructive">
                        Failed to load users.
                      </td>
                    </tr>
                  )}
                  {!isLoading && !isError && users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                        No users found.
                      </td>
                    </tr>
                  )}
                  {users.map((user) => (
                    <tr key={user._id} className="group hover:bg-muted/30 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-accent/10 text-accent">{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge variant="outline" className="border-border/50">{user.role?.toUpperCase()}</Badge>
                      </td>
                      <td className="py-4">
                        <Badge variant="secondary" className={user.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-4 text-sm text-muted-foreground">-</td>
                      <td className="py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => openViewDialog(user._id)}>
                              <Mail className="w-4 h-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditDialog(user._id)}>
                              <UserCheck className="w-4 h-4 mr-2" /> Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive"><UserX className="w-4 h-4 mr-2" /> Block User</DropdownMenuItem>
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
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Detailed user information from backend.</DialogDescription>
          </DialogHeader>
          {selectedUserQuery.isLoading ? (
            <div className="py-6 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-accent" /></div>
          ) : (
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Name:</span> {selectedUserQuery.data?.data.user.name}</p>
              <p><span className="font-semibold">Email:</span> {selectedUserQuery.data?.data.user.email}</p>
              <p><span className="font-semibold">Phone:</span> {selectedUserQuery.data?.data.user.phone ?? "-"}</p>
              <p><span className="font-semibold">Role:</span> {selectedUserQuery.data?.data.user.role}</p>
              <p><span className="font-semibold">Status:</span> {selectedUserQuery.data?.data.user.isActive ? "Active" : "Inactive"}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>Create a new dashboard user.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            <Label>Email</Label>
            <Input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button onClick={submitCreateUser} disabled={createUserMutation.isPending}>
              {createUserMutation.isPending ? "Saving..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            <Label>Email</Label>
            <Input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button onClick={submitUpdateUser} disabled={updateUserMutation.isPending}>
              {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default DashboardUsers;
