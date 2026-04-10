import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import CardBox from '../shared/CardBox';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Login = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false,
    });
    const [error, setError] = useState('');
    const [pendingApproval, setPendingApproval] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleCheckboxChange = (checked) => {
        setFormData({ ...formData, remember: checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setPendingApproval(false);
        setLoading(true);

        const result = await login(formData.email, formData.password);
        
        if (!result.success) {
            if (result.pendingApproval) {
                setPendingApproval(true);
                setError('Your account is pending admin approval.');
            } else {
                setError(result.message);
            }
        }
        
        setLoading(false);
    };

    return (
        <div className="dark h-screen w-full flex justify-center items-center bg-darkgray">
            <div className="md:min-w-[450px] min-w-max px-4">
                <CardBox className="p-8 bg-dark border-darkborder">
                    <div className="flex justify-center mb-4">
                        <div className="text-2xl font-bold text-primary">
                            Souk AI
                        </div>
                    </div>
                    <p className="text-sm text-charcoal text-center mb-6">
                        Your Social Campaigns
                    </p>

                    {error && (
                        <div className={`mb-4 p-3 rounded text-sm ${pendingApproval ? 'bg-lightwarning text-warning' : 'bg-lighterror text-error'}`}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email" className="font-medium">
                                    Email
                                </Label>
                            </div>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password" className="font-medium">
                                    Password
                                </Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="flex flex-wrap gap-6 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Checkbox 
                                    id="remember" 
                                    checked={formData.remember}
                                    onCheckedChange={handleCheckboxChange}
                                />
                                <Label
                                    className="text-link font-normal text-sm"
                                    htmlFor="remember">
                                    Remember this device
                                </Label>
                            </div>
                            <a
                                href="#"
                                className="text-sm font-medium text-primary hover:text-primaryemphasis">
                                Forgot Password?
                            </a>
                        </div>

                        <Button 
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="flex items-center gap-2 justify-center mt-6 flex-wrap">
                        <p className="text-base font-medium text-link dark:text-darklink">
                            New to Souk AI?
                        </p>
                        <a
                            href="/register"
                            className="text-sm font-medium text-primary hover:text-primaryemphasis">
                            Create an account
                        </a>
                    </div>
                </CardBox>
            </div>
        </div>
    );
};

export default Login;
