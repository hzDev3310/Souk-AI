import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
import { Plus, Pencil, Trash2, Search, Truck, Users, Eye } from 'lucide-react';

const ShippingCompanies = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    family_name: '',
    email: '',
    password: '',
    company_name: '',
    companyPhone: '',
    responsiblePhone: '',
    address: '',
    matriculeFiscale: '',
    rib: '',
  });

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/users/shipping-companies');
      setCompanies(response.data.data || []);
    } catch (error) {
      console.error('Error fetching shipping companies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        await axios.put(`/api/admin/users/shipping-companies/${editingCompany.id}`, formData);
      } else {
        await axios.post('/api/admin/users/shipping-companies', formData);
      }
      setIsDialogOpen(false);
      setEditingCompany(null);
      resetForm();
      fetchCompanies();
    } catch (error) {
      console.error('Error saving shipping company:', error);
      alert(error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : 'Error saving shipping company');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('admin.shippingCompanies.messages.confirmDelete'))) return;
    try {
      await axios.delete(`/api/admin/users/shipping-companies/${id}`);
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting shipping company:', error);
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name || '',
      family_name: company.family_name || '',
      email: company.email || '',
      password: '',
      company_name: company.shipping_company?.name || '',
      companyPhone: company.shipping_company?.companyPhone || '',
      responsiblePhone: company.shipping_company?.responsiblePhone || '',
      address: company.shipping_company?.address || '',
      matriculeFiscale: company.shipping_company?.matriculeFiscale || '',
      rib: company.shipping_company?.rib || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      family_name: '',
      email: '',
      password: '',
      company_name: '',
      companyPhone: '',
      responsiblePhone: '',
      address: '',
      matriculeFiscale: '',
      rib: '',
    });
  };

  const handleAdd = () => {
    setEditingCompany(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleViewEmployees = (companyId) => {
    navigate(`/dashboard/shipping-employees?company=${companyId}`);
  };

  const filteredCompanies = companies.filter(company =>
    company.name?.toLowerCase().includes(search.toLowerCase()) ||
    company.email?.toLowerCase().includes(search.toLowerCase()) ||
    company.shipping_company?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-link flex items-center gap-2">
            <Truck className="text-primary" />
            {t('admin.shippingCompanies.title')}
          </h1>
          <p className="text-darklink">{t('admin.shippingCompanies.subtitle')}</p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primaryemphasis">
          <Plus size={18} className="mr-1" />
          {t('admin.shippingCompanies.add')}
        </Button>
      </div>

      {/* Search */}
      <CardBox className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-darklink" size={18} />
            <Input
              placeholder={t('admin.shippingCompanies.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-dark border-darkborder text-link"
            />
          </div>
        </div>
      </CardBox>

      {/* Companies Table */}
      <CardBox className="p-6">
        {loading ? (
          <div className="text-center py-8 text-darklink">{t('admin.common.loading')}</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-darkborder">
                  <TableHead className="text-darklink">{t('admin.shippingCompanies.table.companyName')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.shippingCompanies.table.responsible')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.shippingCompanies.table.email')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.shippingCompanies.table.companyPhone')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.shippingCompanies.table.matricule')}</TableHead>
                  <TableHead className="text-darklink text-right">{t('admin.shippingCompanies.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id} className="border-darkborder/50">
                    <TableCell className="text-link font-medium">
                      {company.shipping_company?.name || company.name}
                    </TableCell>
                    <TableCell className="text-darklink">
                      {company.name} {company.family_name}
                    </TableCell>
                    <TableCell className="text-darklink">{company.email}</TableCell>
                    <TableCell className="text-darklink">{company.shipping_company?.companyPhone || '-'}</TableCell>
                    <TableCell className="text-darklink">{company.shipping_company?.matriculeFiscale || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewEmployees(company.id)}
                          className="text-info hover:text-infoemphasis hover:bg-lightinfo"
                          title="View Employees"
                        >
                          <Users size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(company)}
                          className="text-primary hover:text-primaryemphasis hover:bg-lightprimary"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(company.id)}
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
            {filteredCompanies.length === 0 && (
              <div className="text-center py-8 text-darklink">{t('admin.shippingCompanies.messages.noCompanies')}</div>
            )}
          </div>
        )}
      </CardBox>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-dark border-darkborder max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-link">
              {editingCompany ? t('admin.shippingCompanies.form.editTitle') : t('admin.shippingCompanies.form.addTitle')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.shippingCompanies.form.responsibleFirstName')} *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.shippingCompanies.form.responsibleLastName')}</label>
                <Input
                  value={formData.family_name}
                  onChange={(e) => setFormData({ ...formData, family_name: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-darklink">{t('admin.shippingCompanies.form.email')} *</label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-dark border-darkborder text-link"
              />
            </div>
            {!editingCompany && (
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.shippingCompanies.form.password')} *</label>
                <Input
                  type="password"
                  required={!editingCompany}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm text-darklink">{t('admin.shippingCompanies.form.companyName')}</label>
              <Input
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="bg-dark border-darkborder text-link"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.shippingCompanies.form.companyPhone')}</label>
                <Input
                  value={formData.companyPhone}
                  onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.shippingCompanies.form.responsiblePhone')}</label>
                <Input
                  value={formData.responsiblePhone}
                  onChange={(e) => setFormData({ ...formData, responsiblePhone: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-darklink">{t('admin.shippingCompanies.form.address')}</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="bg-dark border-darkborder text-link"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.shippingCompanies.form.matriculeFiscale')}</label>
                <Input
                  value={formData.matriculeFiscale}
                  onChange={(e) => setFormData({ ...formData, matriculeFiscale: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.shippingCompanies.form.rib')}</label>
                <Input
                  value={formData.rib}
                  onChange={(e) => setFormData({ ...formData, rib: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t('admin.shippingCompanies.form.cancel')}
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primaryemphasis">
                {editingCompany ? t('admin.shippingCompanies.form.update') : t('admin.shippingCompanies.form.create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShippingCompanies;
