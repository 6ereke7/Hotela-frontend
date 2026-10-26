import { Router } from "./router";
import { ThemeProvider } from "@/app/ThemeProvider";

export function App() {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
