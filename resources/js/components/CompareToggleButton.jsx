import { useCompare } from '../context/CompareContext';
import toast from 'react-hot-toast';

export default function CompareToggleButton({ product, variant = 'icon', className = '' }) {
    const { isInCompare, toggle, isFull } = useCompare();
    const inCompare = isInCompare(product.id);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const result = toggle(product);
        if (!result.added && result.full) {
            toast.error('Comparatorul e plin (max 3 produse). Elimina unul pentru a adauga altul.');
        } else if (result.added) {
            toast.success(`${product.name} adaugat in comparator`);
        }
    };

    if (variant === 'full') {
        return (
            <button
                onClick={handleClick}
                disabled={!inCompare && isFull}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all border-2 ${
                    inCompare
                        ? 'bg-blue-500 border-blue-500 text-white shadow-md'
                        : isFull
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-blue-500 text-blue-600 hover:bg-blue-50'
                } ${className}`}
                title={inCompare ? 'Scoate din comparator' : 'Adauga in comparator'}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {inCompare ? 'In comparator' : 'Compara'}
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={!inCompare && isFull}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all backdrop-blur-md ${
                inCompare
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                    : isFull
                    ? 'bg-white/80 text-gray-300 cursor-not-allowed'
                    : 'bg-white/90 text-gray-500 hover:bg-blue-500 hover:text-white shadow-sm'
            } ${className}`}
            title={inCompare ? 'In comparator (click pentru a scoate)' : isFull ? 'Comparatorul e plin' : 'Adauga in comparator'}
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        </button>
    );
}
