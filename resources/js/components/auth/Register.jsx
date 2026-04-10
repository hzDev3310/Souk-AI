import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import CardBox from '../shared/CardBox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Register = () => {
    const { register } = useAuth();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        family_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        // Client fields
        address: '',
        city: '',
        code_postal: '',
        // Influencer fields
        referral_code: '',
        phone: '',
        cin: '',
        // Store fields
        store_name_fr: '',
        store_name_ar: '',
        store_name_en: '',
        matricule_fiscale: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error for this field
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const selectRole = (selectedRole) => {
        setRole(selectedRole);
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        const data = {
            ...formData,
            role,
        };

        const result = await register(data);

        if (result.success) {
            setSuccess(true);
        } else {
            if (result.errors) {
                setErrors(result.errors);
            } else {
                setErrors({ general: result.message });
            }
        }

        setLoading(false);
    };

    const renderRoleSelection = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-center mb-4 text-charcoal">Select your account type</h3>
            <button
                onClick={() => selectRole('CLIENT')}
                className="w-full p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-lightprimary transition duration-200"
            >
                <div className="font-semibold text-link">Client</div>
                <div className="text-sm text-darklink">Shop and order products</div>
            </button>
            <button
                onClick={() => selectRole('INFLUENCER')}
                className="w-full p-4 border-2 border-border rounded-lg hover:border-secondary hover:bg-lightsecondary transition duration-200"
            >
                <div className="font-semibold text-link">Influencer</div>
                <div className="text-sm text-darklink">Promote products and earn commission</div>
            </button>
            <button
                onClick={() => selectRole('STORE')}
                className="w-full p-4 border-2 border-border rounded-lg hover:border-success hover:bg-lightsuccess transition duration-200"
            >
                <div className="font-semibold text-link">Store</div>
                <div className="text-sm text-darklink">Sell your products on our platform</div>
            </button>
        </div>
    );

    const renderCommonFields = () => (
        <>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="name" className="font-medium">First Name *</Label>
                    </div>
                    <Input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="First name"
                        required
                    />
                    {errors.name && <p className="text-error text-xs mt-1">{errors.name[0]}</p>}
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="family_name" className="font-medium">Last Name *</Label>
                    </div>
                    <Input
                        id="family_name"
                        type="text"
                        name="family_name"
                        value={formData.family_name}
                        onChange={handleChange}
                        placeholder="Last name"
                        required
                    />
                    {errors.family_name && <p className="text-error text-xs mt-1">{errors.family_name[0]}</p>}
                </div>
            </div>

            <div>
                <div className="mb-2 block">
                    <Label htmlFor="email" className="font-medium">Email *</Label>
                </div>
                <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                />
                {errors.email && <p className="text-error text-xs mt-1">{errors.email[0]}</p>}
            </div>

            <div>
                <div className="mb-2 block">
                    <Label htmlFor="password" className="font-medium">Password *</Label>
                </div>
                <Input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                    minLength={8}
                />
                {errors.password && <p className="text-error text-xs mt-1">{errors.password[0]}</p>}
            </div>

            <div>
                <div className="mb-2 block">
                    <Label htmlFor="password_confirmation" className="font-medium">Confirm Password *</Label>
                </div>
                <Input
                    id="password_confirmation"
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                />
            </div>
        </>
    );

    const renderRoleSpecificFields = () => {
        switch (role) {
            case 'CLIENT':
                return (
                    <>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="address" className="font-medium">Address</Label>
                            </div>
                            <Input
                                id="address"
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Your address"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="city" className="font-medium">City</Label>
                                </div>
                                <Input
                                    id="city"
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="code_postal" className="font-medium">Postal Code</Label>
                                </div>
                                <Input
                                    id="code_postal"
                                    type="text"
                                    name="code_postal"
                                    value={formData.code_postal}
                                    onChange={handleChange}
                                    placeholder="Postal code"
                                />
                            </div>
                        </div>
                    </>
                );

            case 'INFLUENCER':
                return (
                    <>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="referral_code" className="font-medium">Referral Code *</Label>
                            </div>
                            <Input
                                id="referral_code"
                                type="text"
                                name="referral_code"
                                value={formData.referral_code}
                                onChange={handleChange}
                                placeholder="Referral code"
                                required
                            />
                            {errors.referral_code && <p className="text-error text-xs mt-1">{errors.referral_code[0]}</p>}
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="phone" className="font-medium">Phone *</Label>
                            </div>
                            <Input
                                id="phone"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone number"
                                required
                            />
                            {errors.phone && <p className="text-error text-xs mt-1">{errors.phone[0]}</p>}
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="cin" className="font-medium">CIN (ID Number) *</Label>
                            </div>
                            <Input
                                id="cin"
                                type="text"
                                name="cin"
                                value={formData.cin}
                                onChange={handleChange}
                                placeholder="CIN number"
                                required
                            />
                            {errors.cin && <p className="text-error text-xs mt-1">{errors.cin[0]}</p>}
                        </div>
                    </>
                );

            case 'STORE':
                return (
                    <>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="store_name_fr" className="font-medium">Store Name (FR) *</Label>
                            </div>
                            <Input
                                id="store_name_fr"
                                type="text"
                                name="store_name_fr"
                                value={formData.store_name_fr}
                                onChange={handleChange}
                                placeholder="Store name in French"
                                required
                            />
                            {errors.store_name_fr && <p className="text-error text-xs mt-1">{errors.store_name_fr[0]}</p>}
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="store_name_ar" className="font-medium">Store Name (AR)</Label>
                            </div>
                            <Input
                                id="store_name_ar"
                                type="text"
                                name="store_name_ar"
                                value={formData.store_name_ar}
                                onChange={handleChange}
                                placeholder="Store name in Arabic"
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="store_name_en" className="font-medium">Store Name (EN)</Label>
                            </div>
                            <Input
                                id="store_name_en"
                                type="text"
                                name="store_name_en"
                                value={formData.store_name_en}
                                onChange={handleChange}
                                placeholder="Store name in English"
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="matricule_fiscale" className="font-medium">Tax Registration (Matricule Fiscale) *</Label>
                            </div>
                            <Input
                                id="matricule_fiscale"
                                type="text"
                                name="matricule_fiscale"
                                value={formData.matricule_fiscale}
                                onChange={handleChange}
                                placeholder="Tax registration number"
                                required
                            />
                            {errors.matricule_fiscale && <p className="text-error text-xs mt-1">{errors.matricule_fiscale[0]}</p>}
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    const renderRegistrationForm = () => (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-darklink hover:text-link flex items-center"
                >
                    ← Back to role selection
                </button>
                <div className="mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium bg-lightprimary text-primary">
                    {role === 'CLIENT' && '👤 Client'}
                    {role === 'INFLUENCER' && '🌟 Influencer'}
                    {role === 'STORE' && '🏪 Store'}
                </div>
            </div>

            {renderCommonFields()}
            {renderRoleSpecificFields()}

            {errors.general && (
                <div className="p-3 bg-lighterror text-error rounded-md text-sm">
                    {errors.general}
                </div>
            )}

            <Button
                type="submit"
                className="w-full"
                disabled={loading}
            >
                {loading ? 'Creating account...' : 'Create Account'}
            </Button>
        </form>
    );

    if (success) {
        return (
            <div className="dark min-h-screen flex items-center justify-center bg-darkgray py-8">
                <div className="md:min-w-[450px] min-w-max px-4">
                    <CardBox className="p-8 text-center bg-dark border-darkborder">
                        <div className="w-20 h-20 bg-lightsuccess rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-link">Registration Successful!</h2>
                        <p className="text-darklink mb-6">
                            {role === 'CLIENT'
                                ? 'Welcome! You can now start shopping.'
                                : 'Your account is pending admin approval. You will be notified once approved.'}
                        </p>
                        <Button asChild className="w-full">
                            <a href="/login">Go to Login</a>
                        </Button>
                    </CardBox>
                </div>
            </div>
        );
    }

    return (
        <div className="dark min-h-screen flex items-center justify-center bg-darkgray py-8">
            <div className="md:min-w-[450px] min-w-max px-4">
                <CardBox className="p-8 bg-dark border-darkborder">
                    <div className="flex justify-center mb-4">
                        <div className="text-2xl font-bold text-primary">
                            Souk AI
                        </div>
                    </div>
                    <p className="text-sm text-charcoal text-center mb-6">
                        Create your account
                    </p>

                    {step === 1 ? renderRoleSelection() : renderRegistrationForm()}

                    <div className="flex items-center gap-2 justify-center mt-6 flex-wrap">
                        <p className="text-base font-medium text-link">
                            Already have an account?
                        </p>
                        <a
                            href="/login"
                            className="text-sm font-medium text-primary hover:text-primaryemphasis">
                            Sign in
                        </a>
                    </div>
                </CardBox>
            </div>
        </div>
    );
};

export default Register;
