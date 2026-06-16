import { Link } from 'react-router-dom';
import { FiArrowRight, FiCompass } from 'react-icons/fi';
import Reveal from '../components/Reveal';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <Reveal variant="scaleIn" className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-6 border border-white/[0.06]">
          <FiCompass size={34} className="text-[#F5F0EB]/20" />
        </div>
        <h1 className="font-serif-display text-6xl text-[#C8102E] mb-2 tracking-tight">404</h1>
        <p className="text-[#F5F0EB]/40 font-sans-luxury text-sm mb-2 tracking-wider">Page not found</p>
        <div className="cartier-divider my-6 w-16 mx-auto" />
        <p className="text-[#F5F0EB]/20 text-xs font-sans-luxury mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-[#C8102E] text-[#F5F0EB] px-6 py-3 rounded-full font-sans-luxury text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-[#A00D26] transition-colors shadow-lg shadow-[#C8102E]/20">
          Back to Home <FiArrowRight size={14} />
        </Link>
      </Reveal>
    </div>
  );
};

export default NotFound;
