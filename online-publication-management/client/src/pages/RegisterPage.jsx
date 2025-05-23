// client/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { register } from '../services/api'; // or authService

// --- Theme Definition (Copied from previous examples) ---
const theme = {
    colors: {
        primary: '#0073e6',
        primaryLight: '#40a3ff',
        primaryDark: '#005cb3',
        secondary: '#343a40',
        accent: '#28a745',
        background: '#ffffff',
        surface: '#f8f9fa',
        text: '#212529',
        textLight: '#495057',
        textMuted: '#6c757d',
        border: '#dee2e6',
        inputBorder: '#ced4da',
        inputFocusBorder: '#80bdff',
        shadow: '0 1px 3px rgba(0,0,0,0.1)',
        shadowHover: '0 4px 12px rgba(0,0,0,0.1)',
        topBarDarkBg: '#212529',
        topBarDarkText: '#f8f9fa',
        topBarDarkHoverText: '#ffffff',
        topBarDarkHoverBg: '#343a40',
        topBarDarkActiveText: '#00AEEF',
        errorText: '#dc3545',
        errorBackground: '#f8d7da',
        errorBorder: '#f5c6cb',
    },
    fonts: {
        main: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        headings: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' },
    borderRadius: '6px',
    maxWidth: '1140px',
    topBarHeight: '60px',
    transition: 'all 0.25s ease-in-out',
};

// --- Global Styles (Copied from previous examples) ---
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  body {
    margin: 0;
    padding: 0;
    font-family: ${({ theme }) => theme.fonts.main};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding-top: ${({ theme }) => theme.topBarHeight};
  }
  *, *::before, *::after { box-sizing: border-box; }
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.headings};
    color: ${({ theme }) => theme.colors.text};
    margin-top: 0;
    line-height: 1.3;
    font-weight: 600;
  }
  p { margin-bottom: ${({ theme }) => theme.spacing.md}; color: ${({ theme }) => theme.colors.textLight}; }
  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
    transition: ${({ theme }) => theme.transition};
    &:hover { color: ${({ theme }) => theme.colors.primaryDark}; }
  }
  button, input, textarea, select { font-family: inherit; font-size: inherit; }
`;

// --- Top Bar Styled Components (Copied from previous examples) ---
const TopBar = styled.header`
  background-color: ${({ theme }) => theme.colors.topBarDarkBg};
  color: ${({ theme }) => theme.colors.topBarDarkText};
  padding: 0 ${({ theme }) => theme.spacing.lg};
  height: ${({ theme }) => theme.topBarHeight};
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${({ theme }) => theme.colors.shadow};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const LogoText = styled(RouterLink)`
  font-family: ${({ theme }) => theme.fonts.headings};
  font-size: 1.6rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.topBarDarkText};
  &:hover {
    color: ${({ theme }) => theme.colors.topBarDarkHoverText};
  }
`;

const NavContainer = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.lg};
`;

const MainNav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const NavItem = styled(RouterLink)`
  padding: ${({ theme }) => theme.spacing.sm} 0;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.topBarDarkText};
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  opacity: 0.85;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.topBarDarkActiveText};
    transform: scaleX(0);
    transition: transform 0.25s ease-out;
  }

  &:hover::after,
  &.active::after {
    transform: scaleX(1);
  }

  &.active, &:hover {
    color: ${({ theme }) => theme.colors.topBarDarkActiveText};
    opacity: 1;
  }
  svg { display: none; } 
`;

const UserAuthActions = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const AuthLink = styled(RouterLink)`
    font-weight: 500;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius};
    color: ${({ theme, primary }) => primary ? theme.colors.topBarDarkBg : theme.colors.topBarDarkText};
    background-color: ${({ theme, primary }) => primary ? theme.colors.topBarDarkActiveText : 'transparent'};
    border: 1px solid ${({ theme, primary }) => primary ? theme.colors.topBarDarkActiveText : `${theme.colors.topBarDarkText}66`};
    opacity: 0.9;
    transition: ${({ theme }) => theme.transition};

    &:hover {
        color: ${({ theme, primary }) => primary ? theme.colors.topBarDarkBg : theme.colors.topBarDarkHoverText};
        background-color: ${({ theme, primary }) => primary ? theme.colors.primaryLight : theme.colors.topBarDarkHoverBg};
        border-color: ${({ theme, primary }) => primary ? theme.colors.primaryLight : theme.colors.topBarDarkHoverText};
        opacity: 1;
    }
    svg { display: none; }
`;

// --- Reusable Auth Page Styled Components (from LoginPage, can be extracted to a common file) ---
const AuthContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - ${({ theme }) => theme.topBarHeight});
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.surface}; 
`;

const AuthCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xxl};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.colors.shadowHover};
  width: 100%;
  max-width: 480px; /* Slightly wider for more fields potentially */
  text-align: center;
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const Label = styled.label`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: 500;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background-color: ${({ theme }) => theme.colors.background};

  &:focus {
    border-color: ${({ theme }) => theme.colors.inputFocusBorder};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primaryLight}55`};
  }
`;

const SubmitButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  font-size: 1.05rem;
  font-weight: 600;
  border: none;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: background-color 0.2s ease;
  margin-top: ${({ theme }) => theme.spacing.sm};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.errorText};
  background-color: ${({ theme }) => theme.colors.errorBackground};
  border: 1px solid ${({ theme }) => theme.colors.errorBorder};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: 0.9rem;
  text-align: left;
`;

const HelperText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textMuted};
  a {
      color: ${({ theme }) => theme.colors.primary};
      font-weight: 500;
      &:hover {
          text-decoration: underline;
          color: ${({ theme }) => theme.colors.primaryDark};
      }
  }
`;

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        FullName: '',
        Email: '',
        Password: '',
        Institution: '',
        Country: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { FullName, Email, Password, Institution, Country } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (Password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            await register(formData);
            // Optionally: Log the user in immediately or show a success message
            // For now, redirecting to login page for user to log in.
            // You could also navigate to '/' and auto-login if `register` returns user data + token.
            navigate('/login?registered=true'); // Redirect to login page with a success indicator
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <TopBar>
                <LogoText to="/">PublicationMS</LogoText>
                <NavContainer>
                    <MainNav>
                        {/* <NavItem to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</NavItem> */}
                    </MainNav>
                    <UserAuthActions>
                        <AuthLink to="/login">Log In</AuthLink>
                        <AuthLink
                            to="/register"
                            primary="true"
                            className={location.pathname === '/register' ? 'active' : ''} // Simple active class for demo
                        >
                            Sign Up
                        </AuthLink>
                    </UserAuthActions>
                </NavContainer>
            </TopBar>

            <AuthContentWrapper>
                <AuthCard>
                    <FormTitle>Create an Account</FormTitle>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <StyledForm onSubmit={onSubmit}>
                        <FormGroup>
                            <Label htmlFor="FullName">Full Name</Label>
                            <Input
                                type="text"
                                name="FullName"
                                id="FullName"
                                value={FullName}
                                onChange={onChange}
                                required
                                placeholder="e.g., Ada Lovelace"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="Email">Email Address</Label>
                            <Input
                                type="email"
                                name="Email"
                                id="Email"
                                value={Email}
                                onChange={onChange}
                                required
                                placeholder="you@example.com"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="Password">Password</Label>
                            <Input
                                type="password"
                                name="Password"
                                id="Password"
                                value={Password}
                                onChange={onChange}
                                required
                                placeholder="Minimum 6 characters"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="Institution">Institution (Optional)</Label>
                            <Input
                                type="text"
                                name="Institution"
                                id="Institution"
                                value={Institution}
                                onChange={onChange}
                                placeholder="e.g., University of Science"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="Country">Country (Optional)</Label>
                            <Input
                                type="text"
                                name="Country"
                                id="Country"
                                value={Country}
                                onChange={onChange}
                                placeholder="e.g., United States"
                            />
                        </FormGroup>
                        <SubmitButton type="submit" disabled={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </SubmitButton>
                    </StyledForm>
                    <HelperText>
                        Already have an account? <RouterLink to="/login">Log in here</RouterLink>
                    </HelperText>
                </AuthCard>
            </AuthContentWrapper>
        </ThemeProvider>
    );
};

export default RegisterPage;