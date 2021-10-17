import { useContext } from "react"
import { AuthContext, signOut } from "../contexts/AuthContext"

export default function Dashboard() {
    const { user } = useContext(AuthContext)

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <h1>Dashboard {user?.email}</h1>
            <button onClick={() => signOut()}>Deslogar</button>
        </div>
    )
}
