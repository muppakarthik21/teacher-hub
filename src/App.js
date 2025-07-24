import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard.jsx";
import Radius from "./pages/Radius.jsx";
import Attendance from "./pages/Attendance.jsx";
import Timetable from "./pages/Timetable.jsx";
import NotFound from "./pages/NotFound.js";

const queryClient = new QueryClient();

const AppContent = () => {
  return React.createElement(
    'div',
    { className: "flex min-h-screen bg-background" },
    React.createElement(Navigation),
    React.createElement(
      'main',
      { className: "flex-1 overflow-auto" },
      React.createElement(
        Routes,
        null,
        React.createElement(Route, { path: "/", element: React.createElement(Dashboard) }),
        React.createElement(Route, { path: "/dashboard", element: React.createElement(Dashboard) }),
        React.createElement(Route, { path: "/radius", element: React.createElement(Radius) }),
        React.createElement(Route, { path: "/attendance", element: React.createElement(Attendance) }),
        React.createElement(Route, { path: "/timetable", element: React.createElement(Timetable) }),
        React.createElement(Route, { path: "*", element: React.createElement(NotFound) })
      )
    )
  );
};

const App = () => React.createElement(
  QueryClientProvider,
  { client: queryClient },
  React.createElement(
    TooltipProvider,
    null,
    React.createElement(Toaster),
    React.createElement(Sonner),
    React.createElement(
      BrowserRouter,
      null,
      React.createElement(
        AuthProvider,
        null,
        React.createElement(AppContent)
      )
    )
  )
);

export default App;