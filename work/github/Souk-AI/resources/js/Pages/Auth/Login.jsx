import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { FloatingLabelInput } from '@/Components/ui/Input';
import { Checkbox } from '@/Components/ui/Checkbox';
import { Button } from '@/Components/ui/Button';
import { Icon } from '@/Components/ui/Icon';
import { useLanguage } from '@/Contexts/LanguageProvider';

export default function Login() {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title={t('auth.login.title')} description={t('auth.login.description')}>
            <Head title="Sign In" />

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-6">
                    <FloatingLabelInput
                        id="email"
                        type="email"
                        name="email"
                        label={t('auth.login.email')}
                        value={data.email}
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                    />

                    <FloatingLabelInput
                        id="password"
                        type="password"
                        name="password"
                        label={t('auth.login.password')}
                        value={data.password}
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 bg-surface-container/30 px-3 py-2 rounded-lg border border-outline-variant/10">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <label htmlFor="remember" className="text-sm font-medium text-on-surface ml-2">
                            {t('auth.login.remember')}
                        </label>
                    </div>
                    
                    <Link
                        href={route('password.request')}
                        className="text-sm font-bold text-brand-primary hover:underline underline-offset-4"
                    >
                        {t('auth.login.forgot')}
                    </Link>
                </div>

                <div className="pt-4">
                    <Button
                        type="submit"
                        className="w-full h-14 text-lg font-bold shadow-lg shadow-brand-primary/20"
                        disabled={processing}
                    >
                        {t('auth.login.submit')}
                        <Icon name="arrow_forward" className="ml-2 h-5 w-5" />
                    </Button>
                </div>

                <div className="text-center pt-8">
                    <span className="text-sm text-on-surface-variant">{t('auth.login.signup_prompt')} </span>
                    <Link
                        href={route('register')}
                        className="text-sm font-bold text-brand-secondary dark:text-white hover:underline underline-offset-4"
                    >
                        {t('auth.login.signup_link')}
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
