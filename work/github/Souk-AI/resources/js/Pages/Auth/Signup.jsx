import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { FloatingLabelInput } from '@/Components/ui/Input';
import { Button } from '@/Components/ui/Button';
import { Icon } from '@/Components/ui/Icon';
import { useLanguage } from '@/Contexts/LanguageProvider';

export default function Register() {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <AuthLayout title={t('auth.signup.title')} description={t('auth.signup.description')}>
            <Head title="Sign Up" />

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-6">
                    <FloatingLabelInput
                        id="name"
                        name="name"
                        label={t('auth.signup.name')}
                        value={data.name}
                        autoComplete="name"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        error={errors.name}
                    />

                    <FloatingLabelInput
                        id="email"
                        type="email"
                        name="email"
                        label={t('auth.signup.email')}
                        value={data.email}
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        error={errors.email}
                    />

                    <FloatingLabelInput
                        id="password"
                        type="password"
                        name="password"
                        label={t('auth.signup.password')}
                        value={data.password}
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        error={errors.password}
                    />

                    <FloatingLabelInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        label={t('auth.signup.confirm_password')}
                        value={data.password_confirmation}
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                        error={errors.password_confirmation}
                    />
                </div>

                <div className="pt-4">
                    <Button
                        type="submit"
                        className="w-full h-14 text-lg font-bold shadow-lg shadow-brand-primary/20"
                        disabled={processing}
                    >
                        {t('auth.signup.submit')}
                        <Icon name="person_add" className="ml-2 h-5 w-5" />
                    </Button>
                </div>

                <div className="text-center pt-8">
                    <span className="text-sm text-on-surface-variant">{t('auth.signup.login_prompt')} </span>
                    <Link
                        href={route('login')}
                        className="text-sm font-bold text-brand-secondary dark:text-white hover:underline underline-offset-4"
                    >
                        {t('auth.signup.login_link')}
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
