import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

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
            <h3 className="text-lg font-medium text-center mb-4">Select your account type</h3>
            <button
                onClick={() => selectRole('CLIENT')}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition duration-200"
            >
                <div className="font-semibold">Client</div>
                <div className="text-sm text-gray-600">Shop and order products</div>
            </button>
            <button
                onClick={() => selectRole('INFLUENCER')}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition duration-200"
            >
                <div className="font-semibold">Influencer</div>
                <div className="text-sm text-gray-600">Promote products and earn commission</div>
            </button>
            <button
                onClick={() => selectRole('STORE')}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition duration-200"
            >
                <div className="font-semibold">Store</div>
                <div className="text-sm text-gray-600">Sell your products on our platform</div>
            </button>
        </div>
    );

    const renderCommonFields = () => (
        <>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                        type="text"
                        name="family_name"
                        value={formData.family_name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.family_name && <p className="text-red-500 text-xs mt-1">{errors.family_name[0]}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={8}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                <input
                                    type="text"
                                    name="code_postal"
                                    value={formData.code_postal}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </>
                );

            case 'INFLUENCER':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Referral Code *</label>
                            <input
                                type="text"
                                name="referral_code"
                                value={formData.referral_code}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                            {errors.referral_code && <p className="text-red-500 text-xs mt-1">{errors.referral_code[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CIN (ID Number) *</label>
                            <input
                                type="text"
                                name="cin"
                                value={formData.cin}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                            {errors.cin && <p className="text-red-500 text-xs mt-1">{errors.cin[0]}</p>}
                        </div>
                    </>
                );

            case 'STORE':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name (FR) *</label>
                            <input
                                type="text"
                                name="store_name_fr"
                                value={formData.store_name_fr}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                            {errors.store_name_fr && <p className="text-red-500 text-xs mt-1">{errors.store_name_fr[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name (AR)</label>
                            <input
                                type="text"
                                name="store_name_ar"
                                value={formData.store_name_ar}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name (EN)</label>
                            <input
                                type="text"
                                name="store_name_en"
                                value={formData.store_name_en}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Registration (Matricule Fiscale) *</label>
                            <input
                                type="text"
                                name="matricule_fiscale"
                                value={formData.matricule_fiscale}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                            {errors.matricule_fiscale && <p className="text-red-500 text-xs mt-1">{errors.matricule_fiscale[0]}</p>}
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
                    className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                >
                    ← Back to role selection
                </button>
                <div className="mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {role === 'CLIENT' && '👤 Client'}
                    {role === 'INFLUENCER' && '🌟 Influencer'}
                    {role === 'STORE' && '🏪 Store'}
                </div>
            </div>

            {renderCommonFields()}
            {renderRoleSpecificFields()}

            {errors.general && (
                <div className="p-3 bg-red-100 text-red-800 rounded-md">
                    {errors.general}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
                {loading ? 'Creating account...' : 'Create Account'}
            </button>
        </form>
    );

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Registration Successful!</h2>
                    <p className="text-gray-600 mb-4">
                        {role === 'CLIENT' 
                            ? 'Welcome! You can now start shopping.'
                            : 'Your account is pending admin approval. You will be notified once approved.'}
                    </p>
                    <a
                        href="/login"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Create Account
                </h2>

                {step === 1 ? renderRoleSelection() : renderRegistrationForm()}

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
