import React from 'react';
import { useParams } from 'react-router-dom';
import ProductForm from '@/components/shared/ProductForm';

const ProductEdit = () => {
    const { id } = useParams();
    return <ProductForm mode="edit" productId={id} />;
};

export default ProductEdit;
