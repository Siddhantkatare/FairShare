import { AuthForm } from "../components/auth/AuthForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-accent/20">
      <div className="max-w-md w-full mx-auto">
        <AuthForm />
      </div>
    </div>
  );
};

export default Index;
