import React from 'react';
import ProductForm from '@/components/shared/ProductForm';
import { useAuth } from '@/context/AuthContext';

const ProductCreate = () => {
    const { user } = useAuth();
    return <ProductForm mode="create" role={user?.role === 'store' ? 'store' : 'admin'} />;
};

export default ProductCreate;
