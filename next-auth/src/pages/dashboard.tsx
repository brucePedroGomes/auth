import { useContext } from 'react'
import { AuthContext, signOut } from '../contexts/AuthContext'
import { withSSRAuth } from '../utils/withSSRAuth'

export default function Dashboard() {
    const { user } = useContext(AuthContext)

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1>Dashboard {user?.email}</h1>
            <button onClick={() => signOut()}>Deslogar</button>
        </div>
    )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    return {
        props: {},
    }
})
