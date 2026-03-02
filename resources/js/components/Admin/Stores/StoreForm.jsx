import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Store as StoreIcon, User } from 'lucide-react';
import Modal from '../../UI/Modal';
import Button from '../../UI/Button';
import Input from '../../UI/Input';
import Select from '../../UI/Select';
import { useToast } from '../../../context/ToastContext';

const StoreForm = ({ store, onClose, onSuccess }) => {
    const [owners, setOwners] = useState([]);
    const [loadingOwners, setLoadingOwners] = useState(true);
    const { addToast } = useToast();

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        defaultValues: store ? { name: store.name, user_id: store.user_id } : { name: '', user_id: '' }
    });

    useEffect(() => {
        fetchOwners();
        if (store) reset({ name: store.name, user_id: store.user_id });
    }, [store, reset]);

    const fetchOwners = async () => {
        try {
            const response = await axios.get('/api/admin/users');
            setOwners(response.data.map(user => ({ value: user.id, label: user.name })));
        } catch (error) {
            console.error('Error fetching owners:', error);
            addToast('Failed to load users', 'warning');
        } finally {
            setLoadingOwners(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            if (store) {
                await axios.put(`/api/admin/stores/${store.id}`, data);
                addToast('Store updated successfully', 'success');
            } else {
                await axios.post('/api/admin/stores', data);
                addToast('Store created successfully', 'success');
            }
            onSuccess();
        } catch (error) {
            console.error('Error saving store:', error);
            addToast('Failed to save store. Please check the inputs.', 'error');
        }
    };

    return (
        <Modal
            show={true}
            onClose={onClose}
            title={store ? 'Edit Store' : 'Add New Store'}
            size="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-800 flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white">
                        <StoreIcon size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 dark:text-white">Store Information</h4>
                        <p className="text-xs text-emerald-600 font-medium">Please provide accurate store details</p>
                    </div>
                </div>

                <Input
                    label="Store Name"
                    placeholder="e.g. Green World Market"
                    icon={StoreIcon}
                    error={errors.name?.message}
                    {...register('name', { required: 'Store name is required' })}
                />

                <Select
                    label="Store Owner"
                    placeholder={loadingOwners ? "Loading owners..." : "Select the store manager"}
                    options={owners}
                    error={errors.user_id?.message}
                    {...register('user_id', { required: 'Please select an owner' })}
                />

                <div className="flex gap-4 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isSubmitting}
                        className="flex-1"
                    >
                        {store ? 'Update Store' : 'Create Store'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default StoreForm;
