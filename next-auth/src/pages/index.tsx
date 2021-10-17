import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'

const Home = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { signIn } = useContext(AuthContext)

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        const data = {
            email,
            password,
        }

        await signIn(data)
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    name="email"
                    value={email}
                    placeholder="E-mail"
                    onChange={(event) => setEmail(event.target.value)}
                />
                <input
                    name="password"
                    value={password}
                    placeholder="Password"
                    onChange={(event) => setPassword(event.target.value)}
                />
                <button type="submit">Entrar </button>
            </form>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const cookies = parseCookies(ctx)

    if (cookies['nextauth.token']) {
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false,
            },
        }
    }

    return {
        props: {},
    }
}

export default Home
