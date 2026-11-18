'use client';

import React, { forwardRef } from 'react';
import Image, { ImageProps } from 'next/image';

const DEFAULT_DARK_BLUR =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjEyIiBmaWxsPSIjMGQwZDEyIi8+PC9zdmc+';

export interface NextImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt: string;
}

export const NextImage = forwardRef<HTMLImageElement, NextImageProps>(
  (
    {
      src,
      alt,
      quality = 88,
      placeholder = 'empty',
      blurDataURL,
      referrerPolicy = 'no-referrer',
      className = '',
      ...rest
    },
    ref
  ) => {
    const resolvedBlur =
      placeholder === 'blur' ? blurDataURL || DEFAULT_DARK_BLUR : blurDataURL;

    return (
      <Image
        ref={ref}
        src={src}
        alt={alt}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={resolvedBlur}
        referrerPolicy={referrerPolicy}
        className={className}
        {...rest}
      />
    );
  }
);

NextImage.displayName = 'NextImage';
