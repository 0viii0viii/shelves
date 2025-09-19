import "./App.css";

import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { ClerkWrapper, useClerkAuth } from "./auth/clerk";
import { LoadingScreen } from "./components/LoadingSpinner";
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
  const auth = useClerkAuth();
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
      <ClerkWrapper>
        <App />
      </ClerkWrapper>
    </StrictMode>,
  );
}
