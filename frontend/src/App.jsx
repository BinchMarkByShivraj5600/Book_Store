import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import BookList from './components/BookList';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Book Directory</h1>
        <BookList />
      </Container>
    </ThemeProvider>
  );
}

export default App; 