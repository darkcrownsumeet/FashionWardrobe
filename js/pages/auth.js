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
<button class="fixed top-6 left-6 z-50 border-[2px] border-foreground bg-background hover:bg-foreground hover:text-background p-3 transition-colors flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1" onclick="window.history.length > 1 ? history.back() : Router.navigate('/landing')">
    <span class="material-symbols-outlined text-[18px]">arrow_back</span>
</button>
<main class="flex items-center justify-center min-h-screen bg-background px-4">
    <div class="bg-background p-12 border-[2px] border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] max-w-md w-full text-center relative">
        <div class="absolute top-4 right-4 text-[10px] font-mono tracking-widest font-bold text-muted-foreground">ID: AUTH_SUCCESS</div>
        
        <div class="w-24 h-24 mx-auto border-[2px] border-foreground bg-brand text-brand-foreground flex items-center justify-center font-sans font-black text-5xl mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            ${auth.name ? auth.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <h2 class="font-sans font-black text-4xl uppercase tracking-tighter text-foreground mb-2">${auth.name || 'USER'}</h2>
        <p class="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-12">${auth.email || 'GUEST_OVERRIDE_ACTIVE'}</p>
        
        <div class="space-y-4">
            <button class="w-full bg-brand text-brand-foreground py-5 font-mono text-xs uppercase tracking-[0.2em] font-bold border-[2px] border-brand hover:bg-background hover:text-brand transition-colors shadow-[4px_4px_0px_0px_rgba(255,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1" onclick="Router.navigate('/archive')">
                ACCESS ARCHIVE
            </button>
            <button id="signout-btn" class="w-full bg-background text-foreground py-5 border-[2px] border-foreground font-mono text-xs uppercase tracking-[0.2em] font-bold hover:bg-foreground hover:text-background transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                TERMINATE SESSION
            </button>
        </div>
    </div>
</main>
            `;
        }

        return `
<!-- Back Button -->
<button class="fixed top-6 left-6 z-50 border-[2px] border-foreground bg-background hover:bg-foreground hover:text-background p-3 transition-colors flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 lg:hidden" onclick="window.history.length > 1 ? history.back() : Router.navigate('/landing')">
    <span class="material-symbols-outlined text-[18px]">arrow_back</span>
</button>

<main class="flex min-h-screen">
    <!-- Left Side: Editorial Image -->
    <section class="hidden lg:flex lg:w-1/2 relative border-r-[2px] border-foreground bg-foreground p-12 flex-col justify-between">
        <div class="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed opacity-50 grayscale" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBFYV8uoW8IRlgSICAMQ-SOmrQIEZbCRSMQz_EQYO1iGJAqbJwjCCgNNEWm7IhvY_1wgmpt3dczMTNZ_lku-zx4X1NtW0cqaIM0mteaViUH3NLsloLTD9J0_azh7oFclIkX9KWpC8Y4wDuT5_qZGuD2hCuKT_TpPeww92DfSjSXTLZclwiJTbNkn-r7ILq78JLKYxD6Oy88LDmy0FVVMV-5QPGUG0VFSDOAWJIg03WUWyQAS5CVZE6lel4p45oSBLdCrEIgqFCzEw');"></div>
        <div class="relative z-20">
            <h1 class="font-sans font-black text-6xl text-background uppercase tracking-tighter cursor-pointer" onclick="Router.navigate('/landing')">FASHIONWARDROBE</h1>
        </div>
        <div class="relative z-20 max-w-md">
            <p class="font-mono text-[10px] text-brand tracking-widest uppercase mb-4 font-bold border border-brand px-3 py-1 inline-block">MAISON EDITION</p>
            <p class="font-mono text-sm text-background/80 leading-relaxed uppercase tracking-wider">Curation meets intelligence. Welcome to the next evolution of your personal style journey.</p>
        </div>
    </section>

    <!-- Right Side: Authentication UI -->
    <section class="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 md:px-24 bg-background min-h-screen relative">
        <button class="hidden lg:flex absolute top-8 left-8 border-[2px] border-foreground bg-background hover:bg-foreground hover:text-background p-3 transition-colors items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1" onclick="window.history.length > 1 ? history.back() : Router.navigate('/landing')">
            <span class="material-symbols-outlined text-[18px]">arrow_back</span>
        </button>

        <div class="w-full max-w-[440px] space-y-8">
            <!-- Brand Mobile Only -->
            <div class="lg:hidden mb-8">
                <h1 class="font-sans font-black text-4xl uppercase tracking-tighter text-foreground cursor-pointer" onclick="Router.navigate('/landing')">FASHIONWARDROBE</h1>
            </div>
            
            <!-- Header -->
            <div class="space-y-2" id="auth-header">
                <h2 class="font-sans font-black text-4xl uppercase tracking-tighter text-foreground leading-none" id="auth-title">USER LOGIN</h2>
                <p class="text-muted-foreground font-mono text-[10px] uppercase tracking-widest leading-relaxed" id="auth-subtitle">ENTER YOUR CREDENTIALS TO ACCESS YOUR PROFILE.</p>
            </div>
            
            <!-- Social Actions -->
            <div class="grid grid-cols-1 gap-4" id="social-buttons">
                <div id="google-btn-wrapper" class="w-full flex justify-center items-center"></div>
                <button id="guest-login-btn" class="flex items-center justify-center gap-3 w-full py-3 border-[2px] border-foreground bg-background text-foreground hover:bg-foreground hover:text-background transition-colors font-mono text-xs uppercase tracking-[0.2em] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] group">
                    <span class="material-symbols-outlined text-[18px]">person</span>
                    <span>GUEST OVERRIDE</span>
                </button>
            </div>
            
            <div class="relative py-4">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t-[2px] border-foreground/20"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-4 bg-background text-muted-foreground font-mono text-[10px] uppercase tracking-widest font-bold">OR</span>
                </div>
            </div>

            <!-- Sign In Form -->
            <form id="auth-form" class="space-y-4" novalidate>
                <!-- Name field (only visible in sign-up mode) -->
                <div class="relative hidden" id="name-field">
                    <input class="auth-input block w-full px-4 py-3 bg-background border-[2px] border-foreground focus:outline-none focus:border-brand font-mono text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-colors placeholder:text-muted-foreground" id="fullname" placeholder="FULL NAME" type="text"/>
                    <p class="text-red-500 font-mono text-[10px] uppercase tracking-widest font-bold mt-1 hidden" id="name-error"></p>
                </div>

                <div class="relative">
                    <input class="auth-input block w-full px-4 py-3 bg-background border-[2px] border-foreground focus:outline-none focus:border-brand font-mono text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-colors placeholder:text-muted-foreground" id="email" placeholder="EMAIL ADDRESS" type="email"/>
                    <p class="text-red-500 font-mono text-[10px] uppercase tracking-widest font-bold mt-1 hidden" id="email-error"></p>
                </div>
                
                <div class="relative">
                    <input class="auth-input block w-full px-4 py-3 bg-background border-[2px] border-foreground focus:outline-none focus:border-brand font-mono text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-colors placeholder:text-muted-foreground pr-12" id="password" placeholder="PASSWORD" type="password"/>
                    <button class="absolute right-4 top-3 text-foreground hover:text-brand transition-colors" type="button" id="toggle-password-btn">
                        <span class="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <p class="text-red-500 font-mono text-[10px] uppercase tracking-widest font-bold mt-1 hidden" id="password-error"></p>
                </div>

                <!-- Confirm password field (only visible in sign-up mode) -->
                <div class="relative hidden" id="confirm-password-field">
                    <input class="auth-input block w-full px-4 py-3 bg-background border-[2px] border-foreground focus:outline-none focus:border-brand font-mono text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-colors placeholder:text-muted-foreground" id="confirm-password" placeholder="CONFIRM PASSWORD" type="password"/>
                    <p class="text-red-500 font-mono text-[10px] uppercase tracking-widest font-bold mt-1 hidden" id="confirm-password-error"></p>
                </div>

                <!-- Remember me / Forgot password (sign-in only) -->
                <div class="flex items-center justify-between pt-2" id="signin-extras">
                    <label class="flex items-center gap-3 cursor-pointer group">
                        <input class="w-4 h-4 border-[2px] border-foreground bg-background text-brand focus:ring-brand rounded-none" type="checkbox"/>
                        <span class="font-mono text-[10px] uppercase tracking-widest font-bold text-foreground group-hover:text-brand transition-colors">REMEMBER ME</span>
                    </label>
                    <a class="font-mono text-[10px] uppercase tracking-widest font-bold text-foreground hover:text-brand transition-colors border-b border-foreground hover:border-brand" href="#">FORGOT PASSWORD?</a>
                </div>

                <button type="submit" id="submit-btn" class="w-full bg-brand text-brand-foreground py-4 border-[2px] border-brand font-mono text-sm uppercase tracking-[0.2em] font-bold hover:bg-background hover:text-brand transition-colors shadow-[4px_4px_0px_0px_rgba(255,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 mt-6">
                    AUTHENTICATE
                </button>
                <p class="text-center font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-4 max-w-xs mx-auto leading-relaxed">
                    DATA IS ENCRYPTED AND SECURED LOCALLY ON YOUR DEVICE.
                </p>
            </form>
            
            <!-- Footer -->
            <div class="text-center pt-6 border-t-[2px] border-foreground/20" id="auth-footer">
                <p class="font-mono text-[10px] uppercase tracking-widest text-muted-foreground leading-loose" id="auth-toggle-text">
                    NEED AN ACCOUNT? 
                    <a class="text-foreground font-bold hover:text-brand border-b border-foreground hover:border-brand cursor-pointer inline-block ml-2" id="toggle-auth-mode">CREATE PROFILE</a>
                </p>
            </div>
        </div>
        
        <!-- Bottom Legal -->
        <div class="mt-8 flex gap-8">
            <a class="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-foreground transition-colors" href="#">PRIVACY</a>
            <a class="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-foreground transition-colors" href="#">TERMS</a>
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
        document.getElementById('auth-title').textContent = 'CREATE PROFILE';
        document.getElementById('auth-subtitle').textContent = 'INITIALIZE NEW USER PROFILE AND WARDROBE.';
        document.getElementById('name-field').classList.remove('hidden');
        document.getElementById('confirm-password-field').classList.remove('hidden');
        document.getElementById('signin-extras').classList.add('hidden');
        document.getElementById('submit-btn').textContent = 'INITIALIZE';
        document.getElementById('auth-toggle-text').innerHTML = 
            'ALREADY AUTHORIZED? <a class="text-foreground font-bold hover:text-brand border-b border-foreground hover:border-brand cursor-pointer inline-block ml-2" id="toggle-auth-mode">USER LOGIN</a>';
        // Re-bind toggle
        document.getElementById('toggle-auth-mode')?.addEventListener('click', switchToSignIn);
        clearAllErrors();
    }

    function switchToSignIn() {
        isSignUpMode = false;
        document.getElementById('auth-title').textContent = 'USER LOGIN';
        document.getElementById('auth-subtitle').textContent = 'ENTER YOUR CREDENTIALS TO ACCESS YOUR PROFILE.';
        document.getElementById('name-field').classList.add('hidden');
        document.getElementById('confirm-password-field').classList.add('hidden');
        document.getElementById('signin-extras').classList.remove('hidden');
        document.getElementById('submit-btn').textContent = 'AUTHENTICATE';
        document.getElementById('auth-toggle-text').innerHTML =
            'NEED AN ACCOUNT? <a class="text-foreground font-bold hover:text-brand border-b border-foreground hover:border-brand cursor-pointer inline-block ml-2" id="toggle-auth-mode">CREATE PROFILE</a>';
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

    }

    return { render, init };
})();
