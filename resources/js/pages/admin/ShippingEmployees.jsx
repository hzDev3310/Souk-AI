import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
import { Plus, Pencil, Trash2, Search, ArrowLeft, User, Phone } from 'lucide-react';

const ShippingEmployees = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get('company');
  
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    family_name: '',
    email: '',
    password: '',
    Phone: '',
    address: '',
    cin: '',
    rib: '',
    company_id: '',
  });

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('/api/admin/users/shipping-companies');
      setCompanies(response.data.data || []);
      if (companyId) {
        const company = response.data.data.find(c => c.id === companyId);
        setSelectedCompany(company);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/users/shipping-emps');
      let data = response.data.data || [];
      // Filter by company if selected
      if (companyId) {
        // Note: This assumes shipping employee has a company relationship
        // You may need to adjust based on your actual data structure
        data = data.filter(emp => emp.shipping_emp?.company_id === companyId || emp.user_id === companyId);
      }
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching shipping employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchEmployees();
  }, [companyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        company_id: companyId || formData.company_id,
      };
      
      if (editingEmployee) {
        await axios.put(`/api/admin/users/shipping-emps/${editingEmployee.id}`, submitData);
      } else {
        await axios.post('/api/admin/users/shipping-emps', submitData);
      }
      setIsDialogOpen(false);
      setEditingEmployee(null);
      resetForm();
      fetchEmployees();
    } catch (error) {
      console.error('Error saving shipping employee:', error);
      alert(error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : 'Error saving employee');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('admin.shippingEmployees.messages.confirmDelete'))) return;
    try {
      await axios.delete(`/api/admin/users/shipping-emps/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name || '',
      family_name: employee.family_name || '',
      email: employee.email || '',
      password: '',
      Phone: employee.shipping_emp?.Phone || '',
      address: employee.shipping_emp?.address || '',
      cin: employee.shipping_emp?.cin || '',
      rib: employee.shipping_emp?.rib || '',
      company_id: companyId || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      family_name: '',
      email: '',
      password: '',
      Phone: '',
      address: '',
      cin: '',
      rib: '',
      company_id: companyId || '',
    });
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleBack = () => {
    navigate('/dashboard/shipping-companies');
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name?.toLowerCase().includes(search.toLowerCase()) ||
    employee.email?.toLowerCase().includes(search.toLowerCase()) ||
    employee.shipping_emp?.Phone?.toLowerCase().includes(search.toLowerCase()) ||
    employee.shipping_emp?.cin?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-darklink hover:text-primary"
            >
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-2xl font-bold text-link flex items-center gap-2">
              <User className="text-primary" />
              Shipping Employees
            </h1>
          </div>
          <p className="text-darklink ml-10">
            {selectedCompany 
              ? t('admin.shippingEmployees.subtitleWithCompany', { companyName: selectedCompany.shipping_company?.name || selectedCompany.name })
              : t('admin.shippingEmployees.subtitle')
            }
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primaryemphasis">
          <Plus size={18} className="mr-1" />
          {t('admin.shippingEmployees.add')}
        </Button>
      </div>

      {/* Search */}
      <CardBox className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-darklink" size={18} />
            <Input
              placeholder={t('admin.shippingEmployees.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-dark border-darkborder text-link"
            />
          </div>
          {!companyId && (
            <select
              className="px-3 py-2 rounded-md bg-dark border border-darkborder text-link"
              onChange={(e) => {
                if (e.target.value) {
                  navigate(`/dashboard/shipping-employees?company=${e.target.value}`);
                }
              }}
            >
              <option value="">{t('admin.shippingEmployees.filterByCompany')}</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.shipping_company?.name || company.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </CardBox>

      {/* Employees Table */}
      <CardBox className="p-6">
        {loading ? (
          <div className="text-center py-8 text-darklink">{t('admin.common.loading')}</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-darkborder">
                  <TableHead className="text-darklink">{t('admin.shippingEmployees.table.name')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.shippingEmployees.table.email')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.shippingEmployees.table.phone')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.shippingEmployees.table.cin')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.shippingEmployees.table.address')}</TableHead>
                  <TableHead className="text-darklink text-right">{t('admin.shippingEmployees.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} className="border-darkborder/50">
                    <TableCell className="text-link font-medium">
                      {employee.name} {employee.family_name}
                    </TableCell>
                    <TableCell className="text-darklink">{employee.email}</TableCell>
                    <TableCell className="text-darklink">
                      <div className="flex items-center gap-1">
                        <Phone size={14} />
                        {employee.shipping_emp?.Phone || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-darklink font-mono text-sm">
                      {employee.shipping_emp?.cin || '-'}
                    </TableCell>
                    <TableCell className="text-darklink">{employee.shipping_emp?.address || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(employee)}
                          className="text-primary hover:text-primaryemphasis hover:bg-lightprimary"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(employee.id)}
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
            {filteredEmployees.length === 0 && (
              <div className="text-center py-8 text-darklink">
                {t('admin.shippingEmployees.messages.noEmployees')}
                {selectedCompany && (
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/dashboard/shipping-companies')}
                    >
                      {t('admin.shippingEmployees.messages.viewAllCompanies')}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardBox>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-dark border-darkborder max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-link">
              {editingEmployee ? t('admin.shippingEmployees.form.editTitle') : t('admin.shippingEmployees.form.addTitle')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.shippingEmployees.form.firstName')} *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.shippingEmployees.form.lastName')}</label>
                <Input
                  value={formData.family_name}
                  onChange={(e) => setFormData({ ...formData, family_name: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-darklink">{t('admin.shippingEmployees.form.email')} *</label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-dark border-darkborder text-link"
              />
            </div>
            {!editingEmployee && (
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.shippingEmployees.form.password')} *</label>
                <Input
                  type="password"
                  required={!editingEmployee}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.shippingEmployees.form.phone')}</label>
                <Input
                  value={formData.Phone}
                  onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.shippingEmployees.form.cin')}</label>
                <Input
                  value={formData.cin}
                  onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-darklink">{t('admin.shippingEmployees.form.address')}</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="bg-dark border-darkborder text-link"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-darklink">{t('admin.shippingEmployees.form.rib')}</label>
              <Input
                value={formData.rib}
                onChange={(e) => setFormData({ ...formData, rib: e.target.value })}
                className="bg-dark border-darkborder text-link"
              />
            </div>
            {!companyId && (
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.shippingEmployees.form.company')} *</label>
                <select
                  required
                  value={formData.company_id}
                  onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-dark border border-darkborder text-link"
                >
                  <option value="">{t('admin.shippingEmployees.form.selectCompany')}</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.shipping_company?.name || company.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t('admin.shippingEmployees.form.cancel')}
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primaryemphasis">
                {editingEmployee ? t('admin.shippingEmployees.form.update') : t('admin.shippingEmployees.form.create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShippingEmployees;
