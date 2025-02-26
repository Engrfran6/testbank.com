import AuthForm from '@/components/AuthForm';

const SignUp = async () => {
  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthForm type="sign-up" role="admin" />
    </section>
  );
};
export default SignUp;
