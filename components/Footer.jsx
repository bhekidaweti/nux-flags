import Link from 'next/link';

export default function Footer() {
  return (
    <nav className="w-full h-55 bg-gray-500 text-white flex items-center justify-center px-4">  
        <div className="space-x-6">
          <Link href="https://bheki.co.za" className="hover:text-yellow-300">Bheki Daweti</Link>
        </div>            
    </nav>
  );
}   
