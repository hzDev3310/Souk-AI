import React, { useState } from 'react';

export default function ExampleReact() {
    const [count, setCount] = useState(0);

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-soft-white dark:bg-dark-premium">
            <div className="glass p-12 rounded-[2.5rem] max-w-2xl w-full text-center shadow-2xl border-2 border-white/50 dark:border-white/10">
                <div className="w-20 h-20 bg-blue-ai/20 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-blue-ai" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>

                <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                    React <span className="text-blue-ai">Interactive</span> Page
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    This page is an SPA-like experience powered by React.
                    It handles state locally for smooth, app-like interactions without page reloads.
                </p>

                <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 mb-8 border border-gray-100 dark:border-gray-800 shadow-xl">
                    <p className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-widest">Interactive State Counter</p>
                    <div className="text-6xl font-bold text-gray-900 dark:text-white mb-6">{count}</div>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => setCount(count - 1)}
                            className="w-14 h-14 flex items-center justify-center rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-ai text-2xl transition-all"
                        >
                            -
                        </button>
                        <button
                            onClick={() => setCount(count + 1)}
                            className="px-10 h-14 bg-blue-ai text-white rounded-2xl font-bold shadow-lg shadow-blue-ai/20 hover:scale-105 transition-all"
                        >
                            Increment
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/" className="text-gray-500 hover:text-emerald-deep font-bold transition-colors">
                        Back Home
                    </a>
                    <a href="/example-blade" className="text-gray-500 hover:text-emerald-deep font-bold transition-colors">
                        View Blade version
                    </a>
                </div>
            </div>
        </div>
    );
}
