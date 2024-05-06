import { Navigate } from "react-router-dom"

export default function ProtectedRoute({
    isAllowed,
    to="/",
    element,
}) {
    if (!isAllowed) return <Navigate to={to} />
    return element
}