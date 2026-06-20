/* ============================================
   FashionWardrobe — Authentication Page
   Ported from: authentication_fashionwardrobe/code.html
   ============================================ */

const AuthPage = (() => {
    let isSignUpMode = false;

    function render() {
        if (Store.isAuthenticated()) {
            const auth = Store.getAuth();
            return `
<!-- Back Button -->
<button class="fixed top-6 left-6 z-50 w-11 h-11 rounded-full bg-black/20 backdrop-blur-md border border-white/15 flex items-center justify-center hover:bg-black/40 transition-all duration-300" onclick="window.history.length > 1 ? history.back() : Router.navigate('/landing')">
    <span class="material-symbols-outlined text-white text-[20px]">arrow_back</span>
</button>
<main class="flex items-center justify-center min-h-screen bg-surface px-4">
    <div class="bg-white p-10 md:p-12 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] max-w-md w-full text-center border border-outline-variant/30">
        <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary-container to-surface-container-highest text-primary flex items-center justify-center font-display-lg text-[40px] mb-6 shadow-inner">
            ${auth.name ? auth.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <h2 class="font-headline-lg text-[28px] text-primary mb-2">${auth.name || 'User'}</h2>
        <p class="font-body-md text-secondary mb-10">${auth.email || 'Guest Account'}</p>
        
        <div class="space-y-3">
            <button class="w-full bg-primary text-on-primary py-4 rounded-full font-button text-[12px] uppercase tracking-[0.15em] hover:bg-tertiary-container transition-all shadow-md" onclick="Router.navigate('/saved')">
                View Collection
            </button>
            <button id="signout-btn" class="w-full bg-surface-container-low text-primary py-4 rounded-full border border-outline-variant/30 font-button text-[12px] uppercase tracking-[0.15em] hover:bg-surface-container-high transition-colors">
                Sign Out
            </button>
        </div>
    </div>
</main>
            `;
        }

        return `
<!-- Back Button -->
<button class="fixed top-6 left-6 z-50 w-11 h-11 rounded-full bg-black/20 backdrop-blur-md border border-white/15 flex items-center justify-center hover:bg-black/40 transition-all duration-300" onclick="window.history.length > 1 ? history.back() : Router.navigate('/landing')">
    <span class="material-symbols-outlined text-white text-[20px]">arrow_back</span>
</button>

<main class="flex min-h-screen">
    <!-- Left Side: Editorial Image -->
    <section class="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div class="absolute inset-0 editorial-overlay z-10"></div>
        <div class="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed bg-no-repeat" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBFYV8uoW8IRlgSICAMQ-SOmrQIEZbCRSMQz_EQYO1iGJAqbJwjCCgNNEWm7IhvY_1wgmpt3dczMTNZ_lku-zx4X1NtW0cqaIM0mteaViUH3NLsloLTD9J0_azh7oFclIkX9KWpC8Y4wDuT5_qZGuD2hCuKT_TpPeww92DfSjSXTLZclwiJTbNkn-r7ILq78JLKYxD6Oy88LDmy0FVVMV-5QPGUG0VFSDOAWJIg03WUWyQAS5CVZE6lel4p45oSBLdCrEIgqFCzEw');"></div>
        <div class="absolute top-margin-desktop left-margin-desktop z-20">
            <h1 class="font-headline-lg text-headline-lg tracking-tighter text-on-primary cursor-pointer" onclick="Router.navigate('/landing')">FashionWardrobe</h1>
        </div>
        <div class="absolute bottom-margin-desktop left-margin-desktop z-20 max-w-md">
            <p class="font-label-caps text-label-caps text-on-primary mb-2">Maison Edition</p>
            <p class="font-body-lg text-body-lg text-on-primary/80">Curation meets intelligence. Welcome to the next evolution of your personal style journey.</p>
        </div>
    </section>

    <!-- Right Side: Authentication UI -->
    <section class="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 sm:px-6 md:px-12 lg:px-24 bg-surface min-h-screen">
        <div class="w-full max-w-[440px] space-y-8">
            <!-- Brand Mobile Only -->
            <div class="lg:hidden mb-12">
                <h1 class="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary cursor-pointer" onclick="Router.navigate('/landing')">FashionWardrobe</h1>
            </div>
            <!-- Header -->
            <div class="space-y-2" id="auth-header">
                <h2 class="font-headline-lg text-headline-lg text-primary" id="auth-title">Welcome Back</h2>
                <p class="text-secondary font-body-md" id="auth-subtitle">Enter your details to access your curated wardrobe.</p>
            </div>
            <!-- Social Actions -->
            <div class="grid grid-cols-1 gap-4" id="social-buttons">
                <div id="google-btn-wrapper" class="w-full flex justify-center h-14 items-center"></div>
                <button id="guest-login-btn" class="flex items-center justify-center gap-3 w-full py-4 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-all duration-300 group">
                    <span class="material-symbols-outlined text-primary">person</span>
                    <span class="font-button text-button uppercase tracking-widest text-primary">Continue as Guest</span>
                </button>
            </div>
            <div class="relative py-4">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-outline-variant"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-4 bg-surface text-secondary font-label-caps text-label-caps uppercase">OR</span>
                </div>
            </div>

            <!-- Sign In Form -->
            <form id="auth-form" class="space-y-6" novalidate>
                <!-- Name field (only visible in sign-up mode) -->
                <div class="relative hidden" id="name-field">
                    <input class="auth-input block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary transition-colors peer" id="fullname" placeholder=" " type="text"/>
                    <label class="absolute left-0 top-3 text-secondary font-body-md transition-all pointer-events-none" for="fullname">Full Name</label>
                    <p class="text-error text-[12px] mt-1 hidden" id="name-error"></p>
                </div>

                <div class="relative">
                    <input class="auth-input block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary transition-colors peer" id="email" placeholder=" " type="email"/>
                    <label class="absolute left-0 top-3 text-secondary font-body-md transition-all pointer-events-none" for="email">Email Address</label>
                    <p class="text-error text-[12px] mt-1 hidden" id="email-error"></p>
                </div>
                <div class="relative">
                    <input class="auth-input block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary transition-colors peer" id="password" placeholder=" " type="password"/>
                    <label class="absolute left-0 top-3 text-secondary font-body-md transition-all pointer-events-none" for="password">Password</label>
                    <button class="absolute right-0 top-3 text-secondary hover:text-primary transition-colors" type="button" id="toggle-password-btn">
                        <span class="material-symbols-outlined">visibility</span>
                    </button>
                    <p class="text-error text-[12px] mt-1 hidden" id="password-error"></p>
                </div>

                <!-- Confirm password field (only visible in sign-up mode) -->
                <div class="relative hidden" id="confirm-password-field">
                    <input class="auth-input block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary transition-colors peer" id="confirm-password" placeholder=" " type="password"/>
                    <label class="absolute left-0 top-3 text-secondary font-body-md transition-all pointer-events-none" for="confirm-password">Confirm Password</label>
                    <p class="text-error text-[12px] mt-1 hidden" id="confirm-password-error"></p>
                </div>

                <!-- Remember me / Forgot password (sign-in only) -->
                <div class="flex items-center justify-between pt-2" id="signin-extras">
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-0" type="checkbox"/>
                        <span class="font-label-caps text-[10px] uppercase text-secondary group-hover:text-primary transition-colors">Remember me</span>
                    </label>
                    <a class="font-label-caps text-[10px] uppercase text-secondary hover:text-primary transition-colors underline underline-offset-4" href="#">Forgot Password?</a>
                </div>

                <button type="submit" id="submit-btn" class="w-full bg-primary text-on-primary py-5 rounded-none font-button text-button uppercase tracking-[0.2em] hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/5 active:scale-[0.98]">
                    Sign In
                </button>
                <p class="text-center text-[10px] text-secondary mt-4 max-w-xs mx-auto">
                    Note: Your profile and saved outfits are stored securely on your local device.
                </p>
            </form>
            <!-- Footer -->
            <div class="text-center pt-8" id="auth-footer">
                <p class="font-body-md text-secondary" id="auth-toggle-text">
                    Don't have an account? 
                    <a class="text-primary font-semibold hover:underline underline-offset-4 cursor-pointer" id="toggle-auth-mode">Create Account</a>
                </p>
            </div>
        </div>
        <!-- Bottom Legal -->
        <div class="mt-12 flex gap-gutter">
            <a class="font-label-caps text-[10px] uppercase text-secondary hover:text-primary transition-colors" href="#">Privacy</a>
            <a class="font-label-caps text-[10px] uppercase text-secondary hover:text-primary transition-colors" href="#">Terms</a>
        </div>
    </section>
</main>
        `;
    }

    // --- Helpers ---
    function showError(id, message) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = message;
            el.classList.remove('hidden');
            // Also highlight the input border
            const input = el.previousElementSibling?.tagName === 'INPUT' 
                ? el.previousElementSibling 
                : el.parentElement?.querySelector('input');
            if (input) input.classList.add('border-error');
        }
    }

    function clearError(id) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = '';
            el.classList.add('hidden');
            const input = el.previousElementSibling?.tagName === 'INPUT'
                ? el.previousElementSibling
                : el.parentElement?.querySelector('input');
            if (input) input.classList.remove('border-error');
        }
    }

    function clearAllErrors() {
        ['name-error', 'email-error', 'password-error', 'confirm-password-error'].forEach(clearError);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function handleCredentialResponse(response) {
        try {
            const base64Url = response.credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const payload = JSON.parse(jsonPayload);
            Store.setAuth({ type: 'google', email: payload.email, name: payload.name });
            App.showToast(`Signed in as ${payload.name}`);
            Router.navigate('/landing');
        } catch (e) {
            console.error('Error decoding Google JWT', e);
            App.showToast('Failed to parse Google login');
        }
    }

    function switchToSignUp() {
        isSignUpMode = true;
        document.getElementById('auth-title').textContent = 'Create Account';
        document.getElementById('auth-subtitle').textContent = 'Join FashionWardrobe and discover your perfect style.';
        document.getElementById('name-field').classList.remove('hidden');
        document.getElementById('confirm-password-field').classList.remove('hidden');
        document.getElementById('signin-extras').classList.add('hidden');
        document.getElementById('submit-btn').textContent = 'Create Account';
        document.getElementById('auth-toggle-text').innerHTML = 
            'Already have an account? <a class="text-primary font-semibold hover:underline underline-offset-4 cursor-pointer" id="toggle-auth-mode">Sign In</a>';
        // Re-bind toggle
        document.getElementById('toggle-auth-mode')?.addEventListener('click', switchToSignIn);
        clearAllErrors();
    }

    function switchToSignIn() {
        isSignUpMode = false;
        document.getElementById('auth-title').textContent = 'Welcome Back';
        document.getElementById('auth-subtitle').textContent = 'Enter your details to access your curated wardrobe.';
        document.getElementById('name-field').classList.add('hidden');
        document.getElementById('confirm-password-field').classList.add('hidden');
        document.getElementById('signin-extras').classList.remove('hidden');
        document.getElementById('submit-btn').textContent = 'Sign In';
        document.getElementById('auth-toggle-text').innerHTML =
            'Don\'t have an account? <a class="text-primary font-semibold hover:underline underline-offset-4 cursor-pointer" id="toggle-auth-mode">Create Account</a>';
        // Re-bind toggle
        document.getElementById('toggle-auth-mode')?.addEventListener('click', switchToSignUp);
        clearAllErrors();
    }

    function init() {
        isSignUpMode = false;

        // --- Authenticated Profile View ---
        if (Store.isAuthenticated()) {
            document.getElementById('signout-btn')?.addEventListener('click', () => {
                Store.clearAuth();
                Store.clearSession(); // Clear outfit data too for privacy
                App.showToast('Signed out successfully');
                Router.navigate('/landing');
            });
            return;
        }

        // --- Google Identity Services ---
        let gisAttempts = 0;
        const initGis = setInterval(() => {
            if (window.google && window.google.accounts) {
                clearInterval(initGis);
                const wrapper = document.getElementById("google-btn-wrapper");
                if (!wrapper) return; // if user navigated away
                window.google.accounts.id.initialize({
                    // Must match Google's format exactly or it silently fails to render
                    client_id: "303678922220-i8r6o5smesmo6prqalnrv284fae4o2sc.apps.googleusercontent.com",
                    callback: handleCredentialResponse
                });
                window.google.accounts.id.renderButton(wrapper, {
                    theme: "outline", 
                    size: "large", 
                    width: wrapper.offsetWidth > 0 ? wrapper.offsetWidth : 300, 
                    text: "continue_with"
                });
            } else if (gisAttempts > 20) {
                clearInterval(initGis);
                console.warn("Google Identity Services library failed to load.");
            }
            gisAttempts++;
        }, 100);

        // --- Guest Login ---
        document.getElementById('guest-login-btn')?.addEventListener('click', () => {
            Store.setAuth({ type: 'guest', email: '', name: 'Guest' });
            App.showToast('Continuing as Guest');
            Router.navigate('/landing');
        });

        // --- Email/Password Form with validation ---
        document.getElementById('auth-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            clearAllErrors();

            const email = document.getElementById('email')?.value.trim() || '';
            const password = document.getElementById('password')?.value || '';
            let hasError = false;

            if (isSignUpMode) {
                // --- Sign Up Validation ---
                const fullname = document.getElementById('fullname')?.value.trim() || '';
                const confirmPassword = document.getElementById('confirm-password')?.value || '';

                if (!fullname) {
                    showError('name-error', 'Please enter your full name.');
                    hasError = true;
                }
                if (!email) {
                    showError('email-error', 'Please enter your email address.');
                    hasError = true;
                } else if (!isValidEmail(email)) {
                    showError('email-error', 'Please enter a valid email address.');
                    hasError = true;
                }
                if (!password) {
                    showError('password-error', 'Please create a password.');
                    hasError = true;
                } else if (password.length < 6) {
                    showError('password-error', 'Password must be at least 6 characters.');
                    hasError = true;
                }
                if (!confirmPassword) {
                    showError('confirm-password-error', 'Please confirm your password.');
                    hasError = true;
                } else if (password !== confirmPassword) {
                    showError('confirm-password-error', 'Passwords do not match.');
                    hasError = true;
                }

                if (hasError) return;

                Store.setAuth({ type: 'email', email, name: fullname });
                App.showToast('Account created successfully!');
                Router.navigate('/landing');

            } else {
                // --- Sign In Validation ---
                if (!email) {
                    showError('email-error', 'Please enter your email address.');
                    hasError = true;
                } else if (!isValidEmail(email)) {
                    showError('email-error', 'Please enter a valid email address.');
                    hasError = true;
                }
                if (!password) {
                    showError('password-error', 'Please enter your password.');
                    hasError = true;
                }

                if (hasError) return;

                Store.setAuth({ type: 'email', email, name: email.split('@')[0] });
                App.showToast('Signed in successfully');
                Router.navigate('/landing');
            }
        });

        // --- Toggle Sign In / Create Account ---
        document.getElementById('toggle-auth-mode')?.addEventListener('click', switchToSignUp);

        // --- Password visibility toggle ---
        document.getElementById('toggle-password-btn')?.addEventListener('click', () => {
            const p = document.getElementById('password');
            const icon = document.getElementById('toggle-password-btn').querySelector('.material-symbols-outlined');
            if (p.type === 'password') {
                p.type = 'text';
                icon.textContent = 'visibility_off';
            } else {
                p.type = 'password';
                icon.textContent = 'visibility';
            }
        });

        // --- Clear errors on input ---
        document.getElementById('fullname')?.addEventListener('input', () => clearError('name-error'));
        document.getElementById('email')?.addEventListener('input', () => clearError('email-error'));
        document.getElementById('password')?.addEventListener('input', () => clearError('password-error'));
        document.getElementById('confirm-password')?.addEventListener('input', () => clearError('confirm-password-error'));

        // --- Floating label interactions ---
        document.querySelectorAll('.auth-input').forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.querySelector('label')?.classList.add('text-primary');
            });
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.querySelector('label')?.classList.remove('text-primary');
                }
            });
        });
    }

    return { render, init };
})();
