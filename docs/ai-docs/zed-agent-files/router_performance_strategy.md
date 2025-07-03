# Router Performance Strategy: Proactive Route Preloading

## 1. Executive Summary (TL;DR)

To achieve both a rapid initial page load and instantaneous subsequent navigations, we have implemented a hybrid routing strategy. The application now uses **lazy loading** for all routes, ensuring the initial bundle is minimal. Immediately after the main application shell is interactive, we **proactively preload** the code for other critical routes in the background.

This provides the optimal user experience:
- **Fast Initial Visit:** Users only download the code necessary for the very first page they see.
- **Instantaneous Clicks:** By the time a user interacts with a navigation link, the code for that destination route has likely already been fetched, eliminating any network-induced delay.

## 2. The Challenge: Initial Load vs. Navigation Speed

In modern single-page applications (SPAs), we face a fundamental trade-off:

- **Eager Loading:** Bundling all route code into a single file.
  - **Pro:** Navigation between pages is instantaneous after the initial load.
  - **Con:** The initial load time is slow, as the user must download the entire application upfront. This negatively impacts user experience and Core Web Vitals.

- **Standard Lazy Loading:** Code for each route is split into a separate chunk and is only downloaded when a user clicks a link to navigate to it.
  - **Pro:** The initial load time is extremely fast.
  - **Con:** The *first* click on a link to a not-yet-visited route incurs a noticeable delay while the code chunk is fetched over the network.

Our goal was to eliminate the cons of both approaches.

## 3. The Solution: Proactive Preloading

We selected a hybrid strategy that leverages TanStack Router's built-in capabilities.

1.  **Lazy Load Everything:** All routes are structured for lazy loading using the `.lazy.tsx` file convention and `createLazyFileRoute`. This ensures the initial download is as small and fast as possible.
2.  **Preload on Idle:** Immediately after the primary application component (`__root.tsx`) mounts, we use a `useEffect` hook to trigger the preloading of other important routes. This uses the browser's idle time to fetch the necessary code chunks in the background without impacting the user's current interaction.

## 4. Implementation Details

### Step 1: Converting Routes to be Lazy-Loaded

All routes were converted from the standard `createFileRoute` to `createLazyFileRoute`. This is the essential step that enables code splitting.

Example: `src/routes/about.lazy.tsx`
```path/to/src/routes/about.lazy.tsx
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/about')({
  component: About,
})

function About() {
  return <div className="p-2">Hello from About!</div>
}
```

### Step 2: Implementing the Preloading Logic

In the root component of our application, we programmatically trigger the preloading.

File: `src/routes/__root.tsx`
```path/to/src/routes/__root.tsx
import {
  createRootRoute,
  Link,
  Outlet,
  useRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";

function RootComponent() {
  const router = useRouter();

  useEffect(() => {
    // Proactively preload the '/about' route after the app is interactive
    router.preloadRoute({ to: "/about" });
    // Add other critical routes to preload here in the future
  }, [router]);

  return (
    <>
      <div className="p-2 flex gap-2">
        {/* ... Navigation Links ... */}
      </div>
      <hr />
      <Outlet />
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
```
This hook uses the `useRouter` instance to call `router.preloadRoute()`, telling the router to fetch the code for the `/about` route without navigating to it.

## 5. How to Verify This Strategy

To confirm that preloading is working as expected, use your browser's developer tools:

1.  Open the **Network** tab.
2.  Check the **"Disable cache"** box to simulate a first-time visit.
3.  Load the application's root URL (`/`).
4.  Observe the network waterfall. You will see the initial set of files load, including the route for the current page (e.g., `index.lazy.tsx`).
5.  After a brief moment, **you will see the preloaded route's chunk (e.g., `about.lazy.tsx`) appear in the network log**, even though you have not clicked any links.
6.  Click the navigation link for the preloaded route. Observe that **no new network requests** are made for that route's code. The navigation is instant.