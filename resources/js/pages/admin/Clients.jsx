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
import { Plus, Pencil, Trash2, Search, Users, MapPin } from 'lucide-react';

const Clients = () => {
  const { t } = useTranslation();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    family_name: '',
    email: '',
    password: '',
    address: '',
    city: '',
    codePostal: '',
  });

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/users/clients');
      setClients(response.data.data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await axios.put(`/api/admin/users/clients/${editingClient.id}`, formData);
      } else {
        await axios.post('/api/admin/users/clients', formData);
      }
      setIsDialogOpen(false);
      setEditingClient(null);
      resetForm();
      fetchClients();
    } catch (error) {
      console.error('Error saving client:', error);
      alert(error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : 'Error saving client');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('admin.clients.messages.confirmDelete'))) return;
    try {
      await axios.delete(`/api/admin/users/clients/${id}`);
      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || '',
      family_name: client.family_name || '',
      email: client.email || '',
      password: '',
      address: client.client?.address || '',
      city: client.client?.city || '',
      codePostal: client.client?.codePostal || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      family_name: '',
      email: '',
      password: '',
      address: '',
      city: '',
      codePostal: '',
    });
  };

  const handleAdd = () => {
    setEditingClient(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(search.toLowerCase()) ||
    client.email?.toLowerCase().includes(search.toLowerCase()) ||
    client.client?.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-link flex items-center gap-2">
            <Users className="text-primary" />
            {t('admin.clients.title')}
          </h1>
          <p className="text-darklink">{t('admin.clients.subtitle')}</p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primaryemphasis">
          <Plus size={18} className="mr-1" />
          {t('admin.clients.add')}
        </Button>
      </div>

      {/* Search */}
      <CardBox className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-darklink" size={18} />
            <Input
              placeholder={t('admin.clients.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-dark border-darkborder text-link"
            />
          </div>
        </div>
      </CardBox>

      {/* Clients Table */}
      <CardBox className="p-6">
        {loading ? (
          <div className="text-center py-8 text-darklink">{t('admin.common.loading')}</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-darkborder">
                  <TableHead className="text-darklink">{t('admin.clients.table.name')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.clients.table.email')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.clients.table.city')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.clients.table.postalCode')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.clients.table.status')}</TableHead>
                  <TableHead className="text-darklink text-right">{t('admin.clients.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="border-darkborder/50">
                    <TableCell className="text-link font-medium">
                      {client.name} {client.family_name}
                    </TableCell>
                    <TableCell className="text-darklink">{client.email}</TableCell>
                    <TableCell className="text-darklink">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        {client.client?.city || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-darklink">{client.client?.codePostal || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${client.isBlocked ? 'bg-lighterror text-error' : 'bg-lightsuccess text-success'}`}>
                        {client.isBlocked ? t('admin.clients.status.blocked') : t('admin.clients.status.active')}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(client)}
                          className="text-primary hover:text-primaryemphasis hover:bg-lightprimary"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(client.id)}
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
            {filteredClients.length === 0 && (
              <div className="text-center py-8 text-darklink">{t('admin.clients.messages.noClients')}</div>
            )}
          </div>
        )}
      </CardBox>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-dark border-darkborder max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-link">
              {editingClient ? t('admin.clients.form.editTitle') : t('admin.clients.form.addTitle')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.clients.form.firstName')} *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.clients.form.lastName')}</label>
                <Input
                  value={formData.family_name}
                  onChange={(e) => setFormData({ ...formData, family_name: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-darklink">{t('admin.clients.form.email')} *</label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-dark border-darkborder text-link"
              />
            </div>
            {!editingClient && (
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.clients.form.password')} *</label>
                <Input
                  type="password"
                  required={!editingClient}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.clients.form.city')}</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.clients.form.postalCode')}</label>
                <Input
                  value={formData.codePostal}
                  onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-darklink">{t('admin.clients.form.address')}</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="bg-dark border-darkborder text-link"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t('admin.clients.form.cancel')}
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primaryemphasis">
                {editingClient ? t('admin.clients.form.update') : t('admin.clients.form.create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;
