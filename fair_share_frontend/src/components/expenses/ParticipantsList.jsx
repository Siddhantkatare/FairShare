
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { PlusCircle, Trash2 } from "lucide-react";

const ParticipantsList = ({ participants, setParticipants }) => {
  // Add participant
  const addParticipant = () => {
    setParticipants([
      ...participants,
      { id: Date.now().toString(), name: "", email: "" },
    ]);
  };

  // Update participant
  const updateParticipant = (id, field, value) => {
    setParticipants(
      participants.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  // Remove participant
  const removeParticipant = (id) => {
    if (participants.length <= 2) {
      toast.error("At least 2 participants are required");
      return;
    }
    setParticipants(participants.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 mb-4">
        <h2 className="text-lg font-medium">Participants</h2>
        <p className="text-sm text-muted-foreground">
          Add at least 2 people who are involved in this expense
        </p>
      </div>

      {participants.map((participant, index) => (
        <motion.div
          key={participant.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className="grid gap-4 md:grid-cols-2 items-start relative p-4 border rounded-md bg-background"
        >
          <div className="space-y-2">
            <Label htmlFor={`name-${participant.id}`}>Name</Label>
            <Input
              id={`name-${participant.id}`}
              value={participant.name}
              onChange={(e) =>
                updateParticipant(participant.id, "name", e.target.value)
              }
              placeholder="Enter name"
              className="focus-ring"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`email-${participant.id}`}>Email</Label>
            <div className="flex">
              <Input
                id={`email-${participant.id}`}
                type="email"
                value={participant.email}
                onChange={(e) =>
                  updateParticipant(participant.id, "email", e.target.value)
                }
                placeholder="Enter email"
                className="focus-ring"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeParticipant(participant.id)}
                className="ml-2 flex-shrink-0 text-muted-foreground hover:text-destructive"
                disabled={participants.length <= 2}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addParticipant}
        className="w-full gap-2"
      >
        <PlusCircle className="h-4 w-4" />
        Add Participant
      </Button>
    </div>
  );
};

export default ParticipantsList;