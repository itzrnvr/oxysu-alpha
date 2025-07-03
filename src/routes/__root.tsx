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
  }, [router]);

  return (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
