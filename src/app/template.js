export default function Template({ children }) {
  return (
    <div className="animate-page-enter flex-grow flex flex-col w-full h-full min-h-screen">
      {children}
    </div>
  );
}
