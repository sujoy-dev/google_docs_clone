import TextEditor from "./TextEditor";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          exact
          element={<Navigate to={`/document/${uuidV4()}`} />}
        />
        <Route path="/document/:id" element={<TextEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
