import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, Filter, MoreHorizontal, UserCheck, UserX, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const users = [
  {
    id: "1",
    name: "Ahmed Mohamed",
    email: "ahmed@example.com",
    role: "Admin",
    status: "Active",
    joined: "Oct 20, 2023",
  },
  {
    id: "2",
    name: "Sara Ahmed",
    email: "sara@example.com",
    role: "User",
    status: "Active",
    joined: "Oct 22, 2023",
  },
  {
    id: "3",
    name: "Zaki Ibrahim",
    email: "zaki@example.com",
    role: "User",
    status: "Blocked",
    joined: "Oct 15, 2023",
  },
];

const DashboardUsers = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-playfair tracking-tight">Users Management</h1>
            <p className="text-muted-foreground mt-1">Manage user accounts, roles, and permissions.</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite User
          </Button>
        </div>

        <Card className="glass-card border-border/50">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search users by name or email..." className="pl-10 bg-muted/50 border-none" />
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
                  {users.map((user) => (
                    <tr key={user.id} className="group hover:bg-muted/30 transition-colors">
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
                        <Badge variant="outline" className="border-border/50">{user.role}</Badge>
                      </td>
                      <td className="py-4">
                        <Badge variant="secondary" className={user.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-sm text-muted-foreground">{user.joined}</td>
                      <td className="py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem><Mail className="w-4 h-4 mr-2" /> Send Email</DropdownMenuItem>
                            <DropdownMenuItem><UserCheck className="w-4 h-4 mr-2" /> Make Admin</DropdownMenuItem>
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
    </DashboardLayout>
  );
};

export default DashboardUsers;
