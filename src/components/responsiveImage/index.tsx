'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { useDarkMode } from 'usehooks-ts';

export function ResponsiveImage({ src, alt, fallbackSrc, darkSrc, ...rest }: ImageProps & { fallbackSrc?: string, darkSrc?: string }) {
    const [imgSrc, setImgSrc] = useState(src);

    // TODO: The existence of this line below is the reason why the toggle button isnt working... why????
    const { isDarkMode } = useDarkMode({ initializeWithValue: false });

    return (
        <Image
            {...rest}
            src={isDarkMode ? (darkSrc ?? imgSrc) : imgSrc}
            alt={alt}
            onError={() => {
                if (!!fallbackSrc) {
                    setImgSrc(fallbackSrc);
                }
            }}
        />
    )
};