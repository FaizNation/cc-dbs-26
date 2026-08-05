import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterInput from '../components/RegisterInput';
import { register } from '../utils/network-data';
import LocaleContext from '../contexts/LocaleContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { locale } = React.useContext(LocaleContext);

  async function onRegisterHandler(user) {
    const { error } = await register(user);
    if (!error) {
      navigate('/');
    }
  }

  return (
    <section className="register-page">
      <h2>{locale === 'id' ? 'Daftar Akun' : 'Register Account'}</h2>
      <RegisterInput register={onRegisterHandler} />
      <p>
        {locale === 'id' ? 'Sudah punya akun? ' : 'Already have an account? '}
        <Link to="/">{locale === 'id' ? 'Login di sini' : 'Login here'}</Link>
      </p>
    </section>
  );
}

export default RegisterPage;
