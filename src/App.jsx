import Login from "./pages/Login.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";

function App() {

      return (
          <AuthProvider>
                <Login />
          </AuthProvider>
      );
}

export default App;
