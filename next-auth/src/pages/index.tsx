import { FormEvent, useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn } = useContext(AuthContext);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const data = {
      email,
      password,
    };

    await signIn(data);
  };

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
  );
};

export default Home;
