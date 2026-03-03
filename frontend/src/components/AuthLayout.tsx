interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
      {/* Card container */}
      <div className="w-full max-w-md bg-white py-10 px-8 shadow-2xl rounded-2xl border border-gray-100">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-center text-sm text-gray-600 mb-4">{subtitle}</p>
        )}
        <div className="mt-6 text-left">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
