{{-- Toast Container --}}
<div id="toast-container"
    class="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col-reverse items-center gap-3 pointer-events-none">
</div>

<style>
    @keyframes toast-in {
        from { opacity: 0; transform: translateY(16px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes toast-out {
        from { opacity: 1; transform: translateY(0) scale(1); }
        to { opacity: 0; transform: translateY(16px) scale(0.95); }
    }
    .toast-enter { animation: toast-in 0.3s cubic-bezier(0.21, 1.02, 0.73, 1) forwards; }
    .toast-exit { animation: toast-out 0.25s cubic-bezier(0.06, 0.71, 0.55, 1) forwards; }
</style>

<script>
    window.showToast = function(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const icons = {
            success: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            error: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            favorite: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
            cart: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
            removed: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>'
        };

        const colors = {
            success: 'bg-emerald-500/95 text-white shadow-emerald-500/30',
            error: 'bg-red-500/95 text-white shadow-red-500/30',
            favorite: 'bg-rose-500/95 text-white shadow-rose-500/30',
            cart: 'bg-primary/95 text-white shadow-primary/30',
            removed: 'bg-muted text-foreground shadow-black/10 border border-border/40'
        };

        const toast = document.createElement('div');
        toast.className = `pointer-events-auto flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-xl backdrop-blur-sm font-bold text-xs tracking-wide ${colors[type] || colors.success} toast-enter`;
        toast.innerHTML = `<span class="flex-shrink-0">${icons[type] || icons.success}</span><span>${message}</span>`;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('toast-enter');
            toast.classList.add('toast-exit');
            toast.addEventListener('animationend', () => toast.remove());
        }, 2500);
    };
</script>
