export default function Footer() {
  return (
    <footer className="w-full py-6 text-center text-gray-500 text-sm border-t border-white/10 mt-auto bg-black/50 backdrop-blur-md">
      <p>© {new Date().getFullYear()} QueueLess MVP. All rights reserved.</p>
    </footer>
  );
}
