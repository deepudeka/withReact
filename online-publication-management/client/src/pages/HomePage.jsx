import React from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import PaperListPage from './PaperListPage'; // Your component for listing papers
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react'; // Ensure this is at the top

// Icons
import {
  FaSearch, FaUserPlus, FaSignInAlt, FaBookMedical, FaUsers, FaFlask, FaLightbulb,
  FaArrowRight, FaChevronRight, FaHome, FaInfoCircle, FaArchive, FaFileUpload, FaEnvelope, FaUserCircle, FaSignOutAlt
} from 'react-icons/fa';


// --- Theme Definition (Modern, Clean, Research-focused) ---
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

    // New for Dark Top Bar
    topBarDarkBg: '#212529', // Dark grey, almost black
    topBarDarkText: '#f8f9fa', // Light text for dark background
    topBarDarkHoverText: '#ffffff',
    topBarDarkHoverBg: '#343a40', // Slightly lighter dark for hover
    topBarDarkActiveText: '#00AEEF', // A distinct accent for active link, e.g. light blue
  },
  fonts: {
    main: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    headings: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px', xxxl: '64px', mega: '96px' },
  borderRadius: '6px',
  maxWidth: '1140px',
  topBarHeight: '60px',
  transition: 'all 0.25s ease-in-out',
};

// --- Global Styles ---
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

// --- Layout Components ---
const PageContainer = styled.div``;

// --- Top Bar (Single, clean, NOW DARK) ---
const TopBar = styled.header`
  background-color: ${({ theme }) => theme.colors.topBarDarkBg}; /* CHANGED */
  color: ${({ theme }) => theme.colors.topBarDarkText}; /* CHANGED */
  padding: 0 ${({ theme }) => theme.spacing.lg};
  height: ${({ theme }) => theme.topBarHeight};
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* border-bottom: 1px solid ${({ theme }) => theme.colors.border}; No border needed for dark bar if distinct enough */
  box-shadow: ${({ theme }) => theme.colors.shadow}; /* Keep shadow for depth */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const LogoText = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.headings};
  font-size: 1.6rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.topBarDarkText}; /* CHANGED */
  &:hover {
    color: ${({ theme }) => theme.colors.topBarDarkHoverText}; /* CHANGED */
  }
`;

const NavContainer = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.lg}; // Gap between MainNav and UserAuthActions
`;

const MainNav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const NavItem = styled(Link)`
  padding: ${({ theme }) => theme.spacing.sm} 0;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.topBarDarkText}; /* CHANGED */
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  opacity: 0.85; // Slightly muted non-active links

  &::after {
    content: '';
    position: absolute;
    bottom: -4px; // Adjusted for better visibility
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.topBarDarkActiveText}; /* CHANGED */
    transform: scaleX(0);
    transition: transform 0.25s ease-out;
  }

  &:hover::after,
  &.active::after {
    transform: scaleX(1);
  }

  &.active, &:hover {
    color: ${({ theme }) => theme.colors.topBarDarkActiveText}; /* CHANGED */
    opacity: 1;
  }
  // Remove icons from general nav items for cleaner look, matching image
  svg { display: none; } 
`;


const UserAuthActions = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm}; // Reduced gap for auth links
`;

const AuthLink = styled(Link)`
    font-weight: 500; // Adjusted for consistency
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius};
    color: ${({ theme, primary }) => primary ? theme.colors.topBarDarkBg : theme.colors.topBarDarkText}; /* Text color on dark bar */
    background-color: ${({ theme, primary }) => primary ? theme.colors.topBarDarkActiveText : 'transparent'}; /* Primary uses accent */
    border: 1px solid ${({ theme, primary }) => primary ? theme.colors.topBarDarkActiveText : theme.colors.topBarDarkText}66; /* Border for non-primary */
    opacity: 0.9;
    transition: ${({ theme }) => theme.transition};


    &:hover {
        color: ${({ theme, primary }) => primary ? theme.colors.topBarDarkBg : theme.colors.topBarDarkHoverText};
        background-color: ${({ theme, primary }) => primary ? theme.colors.primaryLight : theme.colors.topBarDarkHoverBg};
        border-color: ${({ theme, primary }) => primary ? theme.colors.primaryLight : theme.colors.topBarDarkHoverText};
        opacity: 1;
    }
    // Hide icons in auth links if going for the simpler look of the image's dark bar
     svg { display: none; }
`;

const UserProfileLink = styled(Link)`
    font-weight: 500;
    color: ${({ theme }) => theme.colors.topBarDarkText};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius};
    opacity: 0.9;

    svg { 
      margin-right: ${({ theme }) => theme.spacing.xs};
      color: ${({ theme }) => theme.colors.topBarDarkActiveText}; // Icon color
    }

    &:hover {
        background-color: ${({ theme }) => theme.colors.topBarDarkHoverBg};
        color: ${({ theme }) => theme.colors.topBarDarkHoverText};
        opacity: 1;
    }
`;

const LogoutButton = styled.button`
    font-weight: 500;
    color: ${({ theme }) => theme.colors.topBarDarkText};
    background-color: transparent;
    border: 1px solid ${({ theme }) => theme.colors.topBarDarkText}66;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius};
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    opacity: 0.9;
    svg { display: none; }


    &:hover {
        background-color: ${({ theme }) => theme.colors.topBarDarkHoverBg};
        color: ${({ theme }) => theme.colors.topBarDarkHoverText};
        border-color: ${({ theme }) => theme.colors.topBarDarkHoverText};
        opacity: 1;
    }
`;


// --- Hero Section (Search Focused - NO CHANGES HERE from previous) ---
const HeroSearchSection = styled.section`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.mega} ${({ theme }) => theme.spacing.lg};
  text-align: center;
  min-height: calc(70vh - ${({ theme }) => theme.topBarHeight});
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1 {
    font-size: 2.8rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    max-width: 700px;
  }
  p.subtitle {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    max-width: 600px;
  }
`;

const LargeSearchBar = styled.form`
  display: flex;
  width: 100%;
  max-width: 650px;
  box-shadow: ${({ theme }) => theme.colors.shadowHover};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;

  input {
    flex-grow: 1;
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
    font-size: 1.1rem;
    border: 1px solid ${({ theme }) => theme.colors.inputBorder};
    border-right: none;
    outline: none;
    border-radius: ${({ theme }) => theme.borderRadius} 0 0 ${({ theme }) => theme.borderRadius};
    &:focus {
      border-color: ${({ theme }) => theme.colors.inputFocusBorder};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight}33;
    }
  }
  button {
    padding: 0 ${({ theme }) => theme.spacing.xl};
    font-size: 1.1rem;
    font-weight: 600;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    border-radius: 0 ${({ theme }) => theme.borderRadius} ${({ theme }) => theme.borderRadius} 0;
    transition: background-color 0.2s ease;
    &:hover {
      background-color: ${({ theme }) => theme.colors.primaryDark};
    }
  }
`;

const ExampleQueries = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
    margin: 0 ${({ theme }) => theme.spacing.xs};
    &:hover {
        color: ${({ theme }) => theme.colors.primaryDark};
    }
  }
`;

// --- Feature/Value Proposition Section (NO CHANGES HERE) ---
const FeaturesSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xxxl} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.secondary};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
      transform: translateY(-5px);
      box-shadow: ${({ theme }) => theme.colors.shadowHover};
  }

  svg {
    font-size: 2.5rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  h3 {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
  p {
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.textLight};
    line-height: 1.7;
  }
`;

// --- Recent Publications Section (NO CHANGES HERE) ---
const RecentPublicationsSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xxxl} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
`;

// --- Footer (NO CHANGES HERE) ---
const Footer = styled.footer`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: #f8f9fa;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  text-align: center;
  font-size: 0.9rem;

  .footer-links {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    a {
      color: #f8f9fa;
      margin: 0 ${({ theme }) => theme.spacing.sm};
      opacity: 0.8;
      &:hover {
        opacity: 1;
        text-decoration: underline;
      }
    }
  }
  .copyright {
    opacity: 0.7;
  }
`;

// --- HomePage Component ---
const HomePage = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const quickSearch = (query) => {
    setSearchTerm(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login'); // Or wherever you want to redirect after logout
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <PageContainer>
        <TopBar>
          <LogoText to="/">PublicationMS</LogoText>
          <NavContainer> {/* Wrapper for right-aligned items */}
            <MainNav>
              <NavItem to="/" className={location.pathname === '/' || location.pathname === '/home' ? 'active' : ''}>Home</NavItem>
              <NavItem to="/discover" className={location.pathname === '/discover' ? 'active' : ''}>Discover</NavItem>
              {userInfo && (
                <NavItem to="/submit-paper" className={location.pathname === '/submit-paper' ? 'active' : ''}>Submit</NavItem>
              )}
              <NavItem to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</NavItem>
            </MainNav>
            <UserAuthActions>
              {userInfo ? (
                <>
                  <UserProfileLink to="/profile">
                    <FaUserCircle /> {userInfo.FullName}
                  </UserProfileLink>
                  <LogoutButton onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </LogoutButton>
                </>
              ) : (
                <>
                  <AuthLink to="/login">Log in</AuthLink>
                  <AuthLink to="/register" primary="true">Sign up</AuthLink>
                </>
              )}
            </UserAuthActions>
          </NavContainer>
        </TopBar>

        {/* Hero Section and other content remain the same as the ResearchGate-style version */}
        <HeroSearchSection>
          <h1>Access Research. Share Knowledge.</h1>
          <p className="subtitle">
            Discover millions of publications and connect with researchers on PublicationMS.
          </p>
          <LargeSearchBar onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search publications, authors, topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit"><FaSearch /> Search</button>
          </LargeSearchBar>

        </HeroSearchSection>

        <FeaturesSection>
          <SectionTitle>Why PublicationMS?</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FaSearch />
              <h3>Discover Research</h3>
              <p>Access a vast library of publications across all fields. Stay up-to-date with the latest findings.</p>
            </FeatureCard>
            <FeatureCard>
              <FaUsers />
              <h3>Connect & Collaborate</h3>
              <p>Find researchers in your field, build your network, and collaborate on new projects.</p>
            </FeatureCard>
            <FeatureCard>
              <FaLightbulb />
              <h3>Share Your Work</h3>
              <p>Increase the visibility of your publications and track their impact within the scientific community.</p>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesSection>

        <RecentPublicationsSection>
          <SectionTitle>Explore Recent Publications</SectionTitle>
          <div style={{ maxWidth: theme.maxWidth, margin: '0 auto' }}>
            <PaperListPage />
          </div>
        </RecentPublicationsSection>

        <Footer>
          <div className="footer-links">
            <Link to="/about">About Us</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="copyright">
            © {new Date().getFullYear()} PublicationMS. All rights reserved.
          </div>
        </Footer>
      </PageContainer>
    </ThemeProvider>
  );
};

export default HomePage;