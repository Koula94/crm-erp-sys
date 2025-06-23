import { LoginForm } from '@/components/auth/login-form';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">KADIMAR S.A.</h1>
          <p className="text-gray-600">Construction Management System</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}