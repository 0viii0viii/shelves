import "./App.css";

import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { SupabaseAuthProvider, useSupabaseAuth } from "./auth/supabase";
import { LoadingScreen } from "./components/LoadingSpinner";
import { ThemeProvider } from "./contexts/ThemeContext";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree, context: { auth: undefined! } });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const auth = useSupabaseAuth();
  if (auth.isLoading) {
    return <LoadingScreen />;
  }
  return <RouterProvider router={router} context={{ auth }} />;
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider>
        <SupabaseAuthProvider>
          <App />
        </SupabaseAuthProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}
