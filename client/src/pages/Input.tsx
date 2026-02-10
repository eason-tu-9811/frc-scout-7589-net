import { useState } from "react";
import { useData } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function InputPage() {
  const { items, addMatch, settings } = useData();
  const { toast } = useToast();
  const [matchNum, setMatchNum] = useState("");
  const [teamNum, setTeamNum] = useState("");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (id: string, value: any) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchNum || !teamNum) {
      toast({
        title: "Missing Information",
        description: "Please enter Match Number and Team Number.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate network delay for "Google Sheets" feel
    await new Promise(resolve => setTimeout(resolve, 800));

    const payload = {
      matchNumber: matchNum,
      teamNumber: teamNum,
      data: formData
    };

    addMatch(payload);

    // If Google Sheet URL is present, we would attempt to fetch/post here
    // For now, we just log it as requested
    if (settings.googleSheetUrl) {
      console.log("Sending to Google Sheets:", settings.googleSheetUrl, payload);
    }

    toast({
      title: "Data Saved",
      description: `Match ${matchNum} - Team ${teamNum} recorded successfully.`,
      className: "border-primary text-primary-foreground bg-secondary",
    });

    // Reset form
    setMatchNum("");
    setTeamNum("");
    setFormData({});
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Match Scouting</h2>
          <p className="text-muted-foreground">Enter performance data for a specific match.</p>
        </div>
        <div className="flex gap-2">
           <span className="text-xs text-muted-foreground self-end font-mono">
             {settings.googleSheetUrl ? "CONNECTED TO SHEETS" : "LOCAL STORAGE MODE"}
           </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-secondary/30 border-white/10 cyber-border">
          <CardHeader>
            <CardTitle className="text-primary font-display tracking-widest text-lg">MATCH INFO</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Match Number</Label>
              <Input 
                type="number" 
                placeholder="001" 
                value={matchNum}
                onChange={(e) => setMatchNum(e.target.value)}
                className="bg-black/50 border-white/10 font-mono text-lg focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Team Number</Label>
              <Input 
                type="number" 
                placeholder="254" 
                value={teamNum}
                onChange={(e) => setTeamNum(e.target.value)}
                className="bg-black/50 border-white/10 font-mono text-lg focus:border-primary/50"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="h-full bg-secondary/30 border-white/10 hover:border-primary/30 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium uppercase tracking-wide text-gray-300">
                    {item.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {item.type === "score" && (
                    <Input 
                      type="number" 
                      placeholder="0"
                      value={formData[item.id] || ""}
                      onChange={(e) => handleInputChange(item.id, e.target.value)}
                      className="bg-black/50 border-white/10 font-mono text-xl"
                    />
                  )}
                  
                  {item.type === "grade" && (
                    <Select 
                      value={formData[item.id] || ""} 
                      onValueChange={(val) => handleInputChange(item.id, val)}
                    >
                      <SelectTrigger className="bg-black/50 border-white/10 font-mono">
                        <SelectValue placeholder="Select Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {["S", "A", "B", "C", "D", "E", "F"].map((grade) => (
                          <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {item.type === "custom" && (
                    <Textarea 
                      placeholder="Enter notes..."
                      value={formData[item.id] || ""}
                      onChange={(e) => handleInputChange(item.id, e.target.value)}
                      className="bg-black/50 border-white/10 min-h-[80px]"
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="pt-4 flex justify-end">
          <Button 
            type="submit" 
            size="lg"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-black font-bold font-display tracking-widest px-8"
          >
            {isSubmitting ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            SUBMIT DATA
          </Button>
        </div>
      </form>
    </div>
  );
}
