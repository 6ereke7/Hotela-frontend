import { Router } from "./router";
import { ThemeProvider } from "@/app/providers";

export function App() {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
