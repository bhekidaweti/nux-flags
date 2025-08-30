import Image from 'next/image';
import Link from 'next/link';
import CountrySearch from './CountrySearch';


export default function Navbar() {
  return (
    <nav className="w-full h-16 bg-gray-500 text-white flex items-center px-4"> 
        <Image 
          src="/flag.png"
          alt="Flag Icon"
          width={60}
          height={60}
          className="ml-2"
        />  
        <div className="space-x-6">
          <Link href="/" className="hover:text-yellow-300">Home</Link>
          <Link href="/quiz" className="hover:text-yellow-300">Quiz</Link>
          <Link href="/flag-list" className="hover:text-yellow-300">Flag List</Link>
        </div>
        <div className="ml-auto"> 
          <CountrySearch />
        </div>            
    </nav>
  );
}   
