'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { useDarkMode } from 'usehooks-ts';

export function ImagePlus({ src, alt, key, fallbackSrc, darkSrc, ...rest }: ImageProps & { fallbackSrc?: string, darkSrc?: string }) {
    const [imgSrc, setImgSrc] = useState(src);
    const { isDarkMode } = useDarkMode();

    return (
        <Image
            {...rest}
            src={isDarkMode ? (darkSrc ?? imgSrc) : imgSrc}
            alt={alt}
            key={key}
            onError={() => {
                if (!!fallbackSrc) {
                    setImgSrc(fallbackSrc);
                }
            }}
        />
    );
};