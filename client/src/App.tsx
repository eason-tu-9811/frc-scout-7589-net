import { Switch, Route } from "wouter";
import { DataProvider } from "@/lib/store";
import { AppSidebar } from "@/components/layout/AppSidebar";
import InputPage from "@/pages/Input";
import AnalysisPage from "@/pages/Analysis";
import ComparePage from "@/pages/Compare";
import SettingsPage from "@/pages/Settings";
import NotFound from "@/pages/not-found";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <DataProvider>
      <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
        <AppSidebar />
        <main className="flex-1 ml-64 p-8 overflow-y-auto">
          <Switch>
            <Route path="/" component={InputPage} />
            <Route path="/analysis" component={AnalysisPage} />
            <Route path="/compare" component={ComparePage} />
            <Route path="/settings" component={SettingsPage} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <Toaster />
      </div>
    </DataProvider>
  );
}

export default App;
