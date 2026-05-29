export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="anima-blur">
      {children}
    </div>
  );
}