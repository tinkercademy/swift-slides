import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

export function ImageWithFallback({ src, alt, key, fallbackSrc, ...rest }: ImageProps & { fallbackSrc: string }) {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <Image
            {...rest}
            src={imgSrc}
            alt={alt}
            key={key}
            onError={() => {
                setImgSrc(fallbackSrc);
            }}
        />
    );
};