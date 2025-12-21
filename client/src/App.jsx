import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes';
import './App.css';

function App() {
  return (
    <div className="App">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
      <AppRoutes />
    </div>
  );
}

export default App;