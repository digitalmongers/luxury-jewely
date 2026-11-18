'use client';

import React, { createContext, useContext } from 'react';
import { PRODUCT_DATA } from '@/src/data/product';

export type ProductCatalogData = typeof PRODUCT_DATA;

const ProductCatalogContext = createContext<ProductCatalogData>(PRODUCT_DATA);

export const ProductCatalogProvider: React.FC<{
  product?: ProductCatalogData;
  children: React.ReactNode;
}> = ({ product, children }) => {
  return (
    <ProductCatalogContext.Provider value={product ?? PRODUCT_DATA}>
      {children}
    </ProductCatalogContext.Provider>
  );
};

export function useProductCatalog(): ProductCatalogData {
  return useContext(ProductCatalogContext);
}
