"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CreateGroupDialog({ open, onOpenChange, onCreate }) {
  const [groupName, setGroupName] = useState("");

  const handleClose = (nextOpen) => {
    if (!nextOpen) {
      // reset local state when closing
      setGroupName("");
    }
    onOpenChange?.(nextOpen);
  };

  const handleSubmit = async () => {
    if (!onCreate) return;
    await onCreate(groupName);
    // if create is successful, clear the field
    setGroupName("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-cyber-card border-cyber-border">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <Input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
            className="bg-cyber-darker border-cyber-border"
          />
          {/* Later: add member selection here if you want */}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-neon-purple/80 text-black">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
