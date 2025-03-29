import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PlusIcon, Users, X, Info, Split } from "lucide-react";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/formatCurrency";
import { useNavigate } from "react-router-dom";
import { addGroup, getAllGroups } from "../../api/groupApi";
import { loggedData, ToastProperty } from "../../lib/config";

export const GroupsList = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const loginData = loggedData();
  const [members, setMembers] = useState([
    { id: "1", email: "" },
  ]);

  const getGroups = async () => {
    const response = await getAllGroups(loginData.token);
    if (response.success) {
      setGroups(response.allGroups)
    } else {
      toast.error(response.data.message, ToastProperty)
    }
  }

  const addMember = () => {
    setMembers([
      ...members,
      { id: Date.now().toString(), email: "" },
    ]);
  };

  const updateMember = (id, email) => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, email } : m))
    );
  };

  const removeMember = (id) => {
    if (members.length <= 1) {
      toast.error("At least one member is required");
      return;
    }
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    if (members.some((m) => !m.email.trim())) {
      toast.error("Please enter email for all members");
      return;
    }

    const newGroup = {
      name: groupName,
      description,
      members
    };
    const response = await addGroup(loginData.token, newGroup);
    if (response.success) {
      toast.success(response.message, ToastProperty);
      setIsDialogOpen(false);
      resetForm();
      getGroups();
    } else {
      toast.error(response.message, ToastProperty)
    }
  };

  const resetForm = () => {
    setGroupName("");
    setDescription("");
    setMembers([{ id: "1", email: "" }]);
  };

  const navigateToGroupDetail = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  useEffect(() => {
    getGroups();
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Groups</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <PlusIcon className="h-4 w-4" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create a new group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g., Weekend Trip"
                  className="focus-ring"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description of group"
                  className="focus-ring"
                />
              </div>

              <div className="space-y-2">
                <Label>Invite Members</Label>
                {members.map((member, index) => (
                  <div key={member.id} className="flex items-center gap-2">
                    <Input
                      type="email"
                      value={member.email}
                      onChange={(e) => updateMember(member.id, e.target.value)}
                      placeholder="Enter email address"
                      className="focus-ring"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMember(member.id)}
                      className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                      disabled={members.length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addMember} className="w-full mt-2">
                  Add Another Member
                </Button>
              </div>

              <Button onClick={handleCreateGroup} className="w-full">
                Create Group
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {groups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => navigateToGroupDetail(group.id)}
              className="cursor-pointer"
            >
              <Card className="p-5 hover:shadow-md transition-shadow duration-300 border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{group.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {/* {group.members} {group.members === 1 ? "member" : "members"} */}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{group.description}</p>

                <div className="flex justify-between items-center mt-3 pt-3">
                  <span className="text-sm text-muted-foreground">Members</span>
                  <span className="font-medium">
                    {group.members.length}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-3 pt-3 border-t">
                  <span className="text-sm text-muted-foreground">Total expenses</span>
                  <span className="font-medium">
                    {/* {formatCurrency(group.totalExpenses)} */}0
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {groups.length === 0 && (
        <div className="text-center py-12 border rounded-lg bg-background">
          <h3 className="text-lg font-medium mb-2">No groups yet</h3>
          <p className="text-muted-foreground mb-6">
            Create a group to start splitting expenses with friends
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-1">
                <PlusIcon className="h-4 w-4" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create a new group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input
                    id="groupName"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g., Weekend Trip"
                    className="focus-ring"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description of group"
                    className="focus-ring"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Invite Members</Label>
                  {members.map((member, index) => (
                    <div key={member.id} className="flex items-center gap-2">
                      <Input
                        type="email"
                        value={member.email}
                        onChange={(e) => updateMember(member.id, e.target.value)}
                        placeholder="Enter email address"
                        className="focus-ring"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMember(member.id)}
                        className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                        disabled={members.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addMember} className="w-full mt-2">
                    Add Another Member
                  </Button>
                </div>

                <Button onClick={handleCreateGroup} className="w-full">
                  Create Group
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};
