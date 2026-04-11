import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import CardBox from '@/components/shared/CardBox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, Search, Store } from 'lucide-react';

const Stores = () => {
  const { t } = useTranslation();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    family_name: '',
    email: '',
    password: '',
    name_fr: '',
    name_ar: '',
    storePhone: '',
    address: '',
    matriculeFiscale: '',
    rib: '',
  });

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/users/stores');
      setStores(response.data.data || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('formData:', formData);
      if (editingStore) {
        const response = await axios.put(`/api/admin/users/stores/${editingStore.id}`, formData);
        console.log('responseData:', response.data);
        console.log('responseDataText:', response.data.toString());
      } else {
        const response = await axios.post('/api/admin/users/stores', formData);
        console.log('responseData:', response.data);
        console.log('responseDataText:', response.data.toString());
      }
      setIsDialogOpen(false);
      setEditingStore(null);
      resetForm();
      fetchStores();
    } catch (error) {
      console.error('Error saving store:', error);
      const errors = error.response?.data?.errors;
      const message = error.response?.data?.message;
      if (errors) {
        const errorText = Object.entries(errors).map(([key, value]) => `${key}: ${value.join(', ')}`).join('\n');
        alert(t('admin.stores.messages.validationError') + '\n\n' + errorText);
      } else if (message) {
        alert(message);
      } else {
        alert(t('admin.stores.messages.errorSaving'));
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('admin.stores.messages.confirmDelete'))) return;
    try {
      await axios.delete(`/api/admin/users/stores/${id}`);
      fetchStores();
    } catch (error) {
      console.error('Error deleting store:', error);
    }
  };

  const handleEdit = (store) => {
    setEditingStore(store);
    setFormData({
      name: store.name || '',
      family_name: store.family_name || '',
      email: store.email || '',
      password: '',
      name_fr: store.store?.name_fr || '',
      name_ar: store.store?.name_ar || '',
      storePhone: store.store?.storePhone || '',
      address: store.store?.address || '',
      matriculeFiscale: store.store?.matriculeFiscale || '',
      rib: store.store?.rib || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      family_name: '',
      email: '',
      password: '',
      name_fr: '',
      name_ar: '',
      storePhone: '',
      address: '',
      matriculeFiscale: '',
      rib: '',
    });
  };

  const handleAdd = () => {
    setEditingStore(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredStores = stores.filter(store =>
    store.name?.toLowerCase().includes(search.toLowerCase()) ||
    store.email?.toLowerCase().includes(search.toLowerCase()) ||
    store.store?.name_fr?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-link flex items-center gap-2">
            <Store className="text-primary" />
            {t('admin.stores.title')}
          </h1>
          <p className="text-darklink">{t('admin.stores.subtitle')}</p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primaryemphasis">
          <Plus size={18} className="mr-1" />
          {t('admin.stores.add')}
        </Button>
      </div>

      {/* Search */}
      <CardBox className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-darklink" size={18} />
            <Input
              placeholder={t('admin.stores.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-dark border-darkborder text-link"
            />
          </div>
        </div>
      </CardBox>

      {/* Stores Table */}
      <CardBox className="p-6">
        {loading ? (
          <div className="text-center py-8 text-darklink">{t('admin.common.loading')}</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-darkborder">
                  <TableHead className="text-darklink">{t('admin.stores.table.storeName')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.stores.table.owner')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.stores.table.email')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.stores.table.phone')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.stores.table.matricule')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.stores.table.status')}</TableHead>
                  <TableHead className="text-darklink text-right">{t('admin.stores.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStores.map((store) => (
                  <TableRow key={store.id} className="border-darkborder/50">
                    <TableCell className="text-link font-medium">
                      {store.store?.name_fr || store.name}
                    </TableCell>
                    <TableCell className="text-link">
                      {store.name} {store.family_name}
                    </TableCell>
                    <TableCell className="text-darklink">{store.email}</TableCell>
                    <TableCell className="text-darklink">{store.store?.storePhone || '-'}</TableCell>
                    <TableCell className="text-darklink">{store.store?.matriculeFiscale || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${store.store?.isActive ? 'bg-lightsuccess text-success' : 'bg-lighterror text-error'}`}>
                        {store.store?.isActive ? t('admin.stores.status.active') : t('admin.stores.status.inactive')}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(store)}
                          className="text-primary hover:text-primaryemphasis hover:bg-lightprimary"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(store.id)}
                          className="text-error hover:text-erroremphasis hover:bg-lighterror"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredStores.length === 0 && (
              <div className="text-center py-8 text-darklink">{t('admin.stores.messages.noStores')}</div>
            )}
          </div>
        )}
      </CardBox>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-dark border-darkborder max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-link">
              {editingStore ? t('admin.stores.form.editTitle') : t('admin.stores.form.addTitle')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.stores.form.ownerFirstName')} *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.stores.form.ownerLastName')}</label>
                <Input
                  value={formData.family_name}
                  onChange={(e) => setFormData({ ...formData, family_name: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-darklink">{t('admin.stores.form.email')} *</label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-dark border-darkborder text-link"
              />
            </div>
            {!editingStore && (
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.stores.form.password')} *</label>
                <Input
                  type="password"
                  required={!editingStore}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.stores.form.storeNameFr')}</label>
                <Input
                  value={formData.name_fr}
                  onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.stores.form.storeNameAr')}</label>
                <Input
                  value={formData.name_ar}
                  onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-darklink">{t('admin.stores.form.storePhone')}</label>
              <Input
                value={formData.storePhone}
                onChange={(e) => setFormData({ ...formData, storePhone: e.target.value })}
                className="bg-dark border-darkborder text-link"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-darklink">{t('admin.stores.form.address')}</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="bg-dark border-darkborder text-link"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.stores.form.matriculeFiscale')}</label>
                <Input
                  value={formData.matriculeFiscale}
                  onChange={(e) => setFormData({ ...formData, matriculeFiscale: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.stores.form.rib')}</label>
                <Input
                  value={formData.rib}
                  onChange={(e) => setFormData({ ...formData, rib: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t('admin.stores.form.cancel')}
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primaryemphasis">
                {editingStore ? t('admin.stores.form.update') : t('admin.stores.form.create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Stores;
