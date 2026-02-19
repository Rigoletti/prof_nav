import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Link as MuiLink,
  Divider,
  Button,
  TextField,
  Stack,
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchoolIcon from '@mui/icons-material/School';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SendIcon from '@mui/icons-material/Send';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      console.log('Subscribed:', email);
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  const navLinks = [
    { label: 'Главная', path: '/', icon: <PsychologyIcon sx={{ fontSize: 16 }} /> },
    { label: 'Тестирование', path: '/test/klimov', icon: <AssessmentIcon sx={{ fontSize: 16 }} /> },
    { label: 'Специальности', path: '/specialties', icon: <SchoolIcon sx={{ fontSize: 16 }} /> },
    { label: 'Избранное', path: '/favorites', icon: <BookmarkIcon sx={{ fontSize: 16 }} /> },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0f172a',
        color: 'white',
        borderTop: '1px solid rgba(99, 102, 241, 0.1)',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} sx={{ py: 3 }}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PsychologyIcon sx={{ color: 'white', fontSize: 18 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>
                  ПрофНавигатор
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Navigation Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 2, 
                fontWeight: 600, 
                color: 'white',
                fontSize: '0.8rem',
              }}
            >
              Навигация
            </Typography>
            <Stack spacing={1}>
              {navLinks.map((link) => (
                <MuiLink
                  key={link.label}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    py: 0.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: 'white',
                    },
                  }}
                >
                  {link.icon}
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          
          <Grid item xs={12} sm={6} md={4}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 2, 
                fontWeight: 600, 
                color: 'white',
                fontSize: '0.8rem',
              }}
            >
              Контакты
            </Typography>
            
            <Stack spacing={1.5} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ color: '#6366f1', fontSize: 16 }} />
                <Typography variant="body2" sx={{ color: '#e2e8f0', fontSize: '0.8rem' }}>
                  prof_nav@mail.ru
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ color: '#6366f1', fontSize: 16 }} />
                <Typography variant="body2" sx={{ color: '#e2e8f0', fontSize: '0.8rem' }}>
                  +7 (999) 123-45-67
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ 
          borderColor: 'rgba(255, 255, 255, 0.05)', 
          my: 1 
        }} />

        <Box
          sx={{
            py: 2,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography variant="caption" sx={{ 
            color: '#64748b', 
            textAlign: { xs: 'center', sm: 'left' },
            fontSize: '0.75rem'
          }}>
            © {currentYear} ПрофНавигатор
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;