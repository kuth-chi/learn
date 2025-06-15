
interface Props {
    children?: React.ReactNode;
}

const layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md md:max-w-3xl p-6 rounded-xl shadow-md">
        {/* This is where the children components will be rendered */}
        {children}
      </div>
    </div>
  );
};
export default layout;
// /auth/layout.tsx