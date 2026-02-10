import { useState } from "react";
import { useData, ItemType } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Link as LinkIcon, Save } from "lucide-react";

export default function SettingsPage() {
  const { items, addItem, removeItem, settings, updateSettings } = useData();
  const { toast } = useToast();
  
  const [newItemName, setNewItemName] = useState("");
  const [newItemType, setNewItemType] = useState<ItemType>("score");
  const [sheetUrl, setSheetUrl] = useState(settings.googleSheetUrl);

  const handleAddItem = () => {
    if (!newItemName) return;
    addItem({ name: newItemName, type: newItemType });
    setNewItemName("");
    toast({ title: "Item Added", description: `${newItemName} added to schema.` });
  };

  const handleSaveSettings = () => {
    updateSettings({ googleSheetUrl: sheetUrl });
    toast({ title: "Settings Saved", description: "Configuration updated successfully." });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-white">System Config</h2>
        <p className="text-muted-foreground">Manage data schema and backend connections.</p>
      </div>

      <div className="grid gap-8">
        <Card className="bg-secondary/30 border-white/10">
          <CardHeader>
            <CardTitle className="text-primary font-display tracking-widest text-lg flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              BACKEND CONNECTION
            </CardTitle>
            <CardDescription>Configure Google Sheets integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Google Apps Script URL</Label>
              <div className="flex gap-2">
                <Input 
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/..." 
                  className="bg-black/50 border-white/10 font-mono text-sm"
                />
                <Button onClick={handleSaveSettings} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the Web App URL of your Google Apps Script to enable cloud syncing.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/30 border-white/10">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-primary font-display tracking-widest text-lg">SCORING SCHEMA</CardTitle>
                <CardDescription>Define what data to collect during matches</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4 items-end bg-black/20 p-4 rounded-md border border-white/5">
              <div className="space-y-2 flex-1">
                <Label>New Item Name</Label>
                <Input 
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Teleop Note Hit" 
                  className="bg-black/50 border-white/10"
                />
              </div>
              <div className="space-y-2 w-40">
                <Label>Type</Label>
                <Select value={newItemType} onValueChange={(v: ItemType) => setNewItemType(v)}>
                  <SelectTrigger className="bg-black/50 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score">Score (123)</SelectItem>
                    <SelectItem value="grade">Grade (S-F)</SelectItem>
                    <SelectItem value="custom">Text (Note)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddItem} className="bg-primary hover:bg-primary/90 text-black font-bold">
                <Plus className="w-4 h-4 mr-2" /> Add
              </Button>
            </div>

            <div className="rounded-md border border-white/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="hover:bg-transparent border-white/10">
                    <TableHead className="text-primary font-display">Item Name</TableHead>
                    <TableHead className="text-primary font-display">Type</TableHead>
                    <TableHead className="text-right text-primary font-display">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-white/5 border-white/5">
                      <TableCell className="font-medium text-gray-300">{item.name}</TableCell>
                      <TableCell>
                        <span className="text-xs uppercase tracking-wider bg-white/10 px-2 py-1 rounded text-gray-400">
                          {item.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
