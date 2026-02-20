"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Settings, Save, Loader2, User, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/auth-client";

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);
  const [nameInput, setNameInput] = useState(session?.user?.name || "");

  const handleSave = async () => {
    setSaving(true);
    // Simulated save - in production, this would call an API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Settings saved successfully");
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your admin account settings
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-400" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Update your admin profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Your name"
                className="border-white/10 bg-white/5"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                value={session?.user?.email || ""}
                disabled
                className="border-white/10 bg-white/5 opacity-50"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              Account Information
            </CardTitle>
            <CardDescription>Your account details and role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <span className="text-muted-foreground">Role</span>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                ADMIN
              </Badge>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <span className="text-muted-foreground">User ID</span>
              <code className="text-xs bg-white/5 px-2 py-1 rounded">
                {session?.user?.id || "N/A"}
              </code>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">Session Status</span>
              <Badge
                variant="outline"
                className="border-green-500/50 text-green-400"
              >
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Platform Settings */}
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-cyan-400" />
              Platform Information
            </CardTitle>
            <CardDescription>About Fractals Academy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <span className="text-muted-foreground">Platform</span>
              <span>Fractals Academy</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <span className="text-muted-foreground">Version</span>
              <Badge
                variant="outline"
                className="border-purple-500/50 text-purple-400"
              >
                v1.0.0
              </Badge>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">Framework</span>
              <span className="text-sm">Next.js 16.1.6</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
