import React from 'react';
import { useParams } from 'react-router-dom';
import ProductForm from '@/components/shared/ProductForm';
import { useAuth } from '@/context/AuthContext';

const ProductEdit = () => {
    const { id } = useParams();
    const { user } = useAuth();
    return <ProductForm mode="edit" productId={id} role={user?.role === 'store' ? 'store' : 'admin'} />;
};

export default ProductEdit;
