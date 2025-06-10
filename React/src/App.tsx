import { UserProvider } from "./contexts/UserContext";
import { BrowserRouter as Router } from "react-router-dom";
import DynamicLayout from "./layouts/DynamicLayout";
import AppRoutes from "./routes";
export default function App() {
  return (
    <Router>
      <UserProvider>
        <DynamicLayout>
          <AppRoutes />
        </DynamicLayout>
      </UserProvider>
    </Router>
  );
}
