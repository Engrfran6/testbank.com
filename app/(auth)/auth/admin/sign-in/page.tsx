import AuthForm from '@/components/AuthForm';

const SignIn = async () => {
  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthForm type="sign-in" role="admin" />
    </section>
  );
};
export default SignIn;
