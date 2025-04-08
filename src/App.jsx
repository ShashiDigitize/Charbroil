import { ThreekitProvider } from '@threekit-tools/treble';
import Custom from './components/Custom.jsx';

const App = () => {
  return (
    <ThreekitProvider>
      <Custom />
    </ThreekitProvider>
  );
};

export default App;
