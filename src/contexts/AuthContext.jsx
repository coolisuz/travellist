import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case ActionNames.LOGIN:
      return { ...state, isAuthenticated: true, user: action.payload };
    case ActionNames.LOGOUT:
      return { ...state, isAuthenticated: false, user: null };
    default:
      throw new Error("Unknow action type");
  }
}

const FAKE_USER = {
  name: "Saidjamol",
  email: "saidjamol@example.com",
  password: "12345",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );
  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: ActionNames.LOGIN, payload: FAKE_USER });
    } else {
      console.log("wrong credentials");
    }
  }

  function logout() {
    dispatch({ type: ActionNames.LOGOUT });
  }

  return (
    <AuthContext.Provider value={{ login, logout, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined)
    throw new Error("Context was used outside of the AuthProvider");

  return context;
}

const ActionNames = {
  LOGIN: "login",
  LOGOUT: "logout",
};

export { AuthProvider, useAuth };
