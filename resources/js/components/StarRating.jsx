export default function StarRating({
    value = 0,
    onChange,
    size = 'sm',
    readOnly = true,
    showValue = false,
    showCount = null,
}) {
    const sizeClasses = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    }[size] || 'w-4 h-4';

    const textSize = {
        xs: 'text-[10px]',
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    }[size] || 'text-xs';

    const stars = [1, 2, 3, 4, 5].map((star) => {
        // fractional fill, 4.3 = primele 4 pline si a 5-a 30%
        const fillPercent = readOnly
            ? Math.max(0, Math.min(1, value - star + 1)) * 100
            : star <= value ? 100 : 0;

        return (
            <button
                key={star}
                type="button"
                onClick={() => !readOnly && onChange?.(star)}
                disabled={readOnly}
                className={`relative ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'} ${sizeClasses}`}
                aria-label={`${star} stele`}
            >
                {/* stea goala */}
                <svg className={`absolute inset-0 ${sizeClasses} text-gray-200`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {/* stea plina cu overlay pentru fractional */}
                <div
                    className={`absolute inset-0 overflow-hidden ${sizeClasses}`}
                    style={{ width: `${fillPercent}%` }}
                >
                    <svg className={`${sizeClasses} text-amber-400`} fill="currentColor" viewBox="0 0 24 24" style={{ minWidth: 'inherit' }}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </div>
            </button>
        );
    });

    return (
        <div className="inline-flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">{stars}</div>
            {showValue && value > 0 && (
                <span className={`font-semibold text-gray-700 ${textSize}`}>
                    {value.toFixed(1)}
                </span>
            )}
            {showCount !== null && (
                <span className={`text-gray-400 ${textSize}`}>
                    {showCount === 0
                        ? 'Fara recenzii'
                        : `(${showCount} ${showCount === 1 ? 'recenzie' : 'recenzii'})`}
                </span>
            )}
        </div>
    );
}
