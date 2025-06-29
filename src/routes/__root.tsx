import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <a href="/" className="[&.active]:font-bold">
          Home
        </a>{' '}
        <a href="/about" className="[&.active]:font-bold">
          About
        </a>
      </div>
      <hr />
      <Outlet />
    </>
  ),
})