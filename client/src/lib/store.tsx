import React, { createContext, useContext, useEffect, useState } from "react";

// Types
export type ItemType = "grade" | "score" | "custom";

export interface ScoringItem {
  id: string;
  name: string;
  type: ItemType;
}

export interface MatchData {
  id: string;
  matchNumber: string;
  teamNumber: string;
  data: Record<string, any>; // itemId -> value
  timestamp: number;
}

export interface AppSettings {
  googleSheetUrl: string;
  teamList: string[]; // Cache of known teams
}

interface DataContextType {
  items: ScoringItem[];
  matches: MatchData[];
  settings: AppSettings;
  addItem: (item: Omit<ScoringItem, "id">) => void;
  removeItem: (id: string) => void;
  addMatch: (match: Omit<MatchData, "id" | "timestamp">) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  getTeamMatches: (teamNumber: string) => MatchData[];
  getAllTeams: () => string[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_ITEMS: ScoringItem[] = [
  { id: "auto_amp", name: "Auto Amp", type: "score" },
  { id: "auto_speaker", name: "Auto Speaker", type: "score" },
  { id: "teleop_amp", name: "Teleop Amp", type: "score" },
  { id: "teleop_speaker", name: "Teleop Speaker", type: "score" },
  { id: "defense_rating", name: "Defense Rating", type: "grade" },
  { id: "notes", name: "Notes", type: "custom" },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Load from local storage or defaults
  const [items, setItems] = useState<ScoringItem[]>(() => {
    const saved = localStorage.getItem("frc_items");
    return saved ? JSON.parse(saved) : DEFAULT_ITEMS;
  });

  const [matches, setMatches] = useState<MatchData[]>(() => {
    const saved = localStorage.getItem("frc_matches");
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem("frc_settings");
    return saved ? JSON.parse(saved) : { googleSheetUrl: "", teamList: [] };
  });

  // Persistence effects
  useEffect(() => localStorage.setItem("frc_items", JSON.stringify(items)), [items]);
  useEffect(() => localStorage.setItem("frc_matches", JSON.stringify(matches)), [matches]);
  useEffect(() => localStorage.setItem("frc_settings", JSON.stringify(settings)), [settings]);

  const addItem = (item: Omit<ScoringItem, "id">) => {
    const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const addMatch = async (match: Omit<MatchData, "id" | "timestamp">) => {
    const newMatch = {
      ...match,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    
    const updatedMatches = [...matches, newMatch];
    setMatches(updatedMatches);
    
    // Update known teams list
    if (!settings.teamList.includes(match.teamNumber)) {
      setSettings(prev => ({ ...prev, teamList: [...prev.teamList, match.teamNumber].sort() }));
    }

    // Google Sheets Integration via URL
    if (settings.googleSheetUrl) {
      try {
        await fetch(settings.googleSheetUrl, {
          method: 'POST',
          mode: 'no-cors', // standard for GAS web apps
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMatch),
        });
      } catch (error) {
        console.error("Failed to sync with Google Sheets:", error);
      }
    }
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const getTeamMatches = (teamNumber: string) => {
    return matches.filter((m) => m.teamNumber === teamNumber);
  };
  
  const getAllTeams = () => {
    // Unique teams from matches
    return Array.from(new Set(matches.map(m => m.teamNumber))).sort((a, b) => parseInt(a) - parseInt(b));
  };

  return (
    <DataContext.Provider
      value={{
        items,
        matches,
        settings,
        addItem,
        removeItem,
        addMatch,
        updateSettings,
        getTeamMatches,
        getAllTeams
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
