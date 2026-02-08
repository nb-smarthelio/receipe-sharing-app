# Components

This directory contains reusable React components for the RecipeShare application.

## Authentication Components

### AuthModal.tsx
A reusable modal wrapper component that handles:
- Opening/closing animations
- Backdrop click to close
- Escape key to close
- Scroll lock when open
- Responsive design

**Usage:**
```tsx
<AuthModal isOpen={isOpen} onClose={closeHandler}>
  <YourContent />
</AuthModal>
```

### LoginForm.tsx
Login form component with:
- Email and password fields
- Form validation
- Error handling and display
- Loading states
- Switch to signup option

**Props:**
- `onSwitchToSignup`: Callback to switch to signup form

### SignupForm.tsx
Signup form component with:
- Full name, username, email, and password fields
- Password confirmation
- Form validation (username format, password length)
- Error handling and display
- Loading states
- Switch to login option

**Props:**
- `onSwitchToLogin`: Callback to switch to login form

### LandingPage.tsx
Main landing page component that:
- Displays hero section, features, and CTAs
- Manages modal state for login/signup
- Handles switching between login and signup modals
- Shows all marketing content

## Usage Pattern

The landing page manages the authentication modal state:

```tsx
const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null)

// Open modals
const openLogin = () => setAuthMode('login')
const openSignup = () => setAuthMode('signup')

// User can switch between login/signup without closing modal
<AuthModal isOpen={authMode === 'login'}>
  <LoginForm onSwitchToSignup={openSignup} />
</AuthModal>

<AuthModal isOpen={authMode === 'signup'}>
  <SignupForm onSwitchToLogin={openLogin} />
</AuthModal>
```

## Form Submission

Both forms use server actions from `lib/actions/auth.ts`:
- `login(formData)` - Handles user login
- `signup(formData)` - Handles user registration

On successful authentication, users are redirected to `/feed`.
