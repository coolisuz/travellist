import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthProvider } from "./contexts/AuthContext";

import CityList from "./components/CityList";
import CountriesList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import SpinnerFullPage from "./components/SpinnerFullPage";

// import Homepage from "./pages/Homepage";
// import Product from "./pages/Product";
// import Pricing from "./pages/Pricing";
// import PageNotFound from "./pages/PageNotFound";
// import AppLayout from "./pages/AppLayout";
// import Login from "./pages/Login";
// import ProtectedRoute from "./pages/ProtectedRoute";

const Homepage = lazy(() => import("./pages/Homepage"));
const Product = lazy(() => import("./pages/Product"));
const Pricing = lazy(() => import("./pages/Pricing"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
const Login = lazy(() => import("./pages/Login"));
const ProtectedRoute = lazy(() => import("./pages/ProtectedRoute"));

// ------------- before suspense -------------
// dist/index.html                   0.48 kB │ gzip:   0.32 kB
// dist/assets/index-8a0edde2.css   29.96 kB │ gzip:   5.07 kB
// dist/assets/index-49699472.js   508.42 kB │ gzip: 148.13 kB

// ------------- after suspense -------------
// dist/index.html                           0.48 kB │ gzip:   0.32 kB
// dist/assets/Logo-515b84ce.css             0.03 kB │ gzip:   0.05 kB
// dist/assets/Login-f39ef3ff.css            0.35 kB │ gzip:   0.22 kB
// dist/assets/Product-cf1be470.css          0.47 kB │ gzip:   0.27 kB
// dist/assets/PageNav-d3c5d403.css          0.51 kB │ gzip:   0.28 kB
// dist/assets/Homepage-380f4eeb.css         0.51 kB │ gzip:   0.30 kB
// dist/assets/AppLayout-c49eff02.css        1.91 kB │ gzip:   0.70 kB
// dist/assets/index-fb137bb8.css           26.29 kB │ gzip:   4.38 kB
// dist/assets/Product.module-02d70b80.js    0.06 kB │ gzip:   0.07 kB
// dist/assets/PageNotFound-a51370a5.js      0.15 kB │ gzip:   0.15 kB
// dist/assets/ProtectedRoute-55240182.js    0.19 kB │ gzip:   0.18 kB
// dist/assets/Logo-c335f3f0.js              0.22 kB │ gzip:   0.19 kB
// dist/assets/PageNav-dc7c5028.js           0.49 kB │ gzip:   0.27 kB
// dist/assets/Pricing-d1469f04.js           0.64 kB │ gzip:   0.41 kB
// dist/assets/Homepage-41c9f279.js          0.67 kB │ gzip:   0.41 kB
// dist/assets/Product-6086d4f7.js           0.85 kB │ gzip:   0.48 kB
// dist/assets/Login-1ca375dd.js             1.04 kB │ gzip:   0.55 kB
// dist/assets/AppLayout-55481566.js       156.97 kB │ gzip:  46.13 kB
// dist/assets/index-9529011e.js           349.79 kB │ gzip: 101.45 kB

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route index element={<Homepage />} />
              <Route path="product" element={<Product />} />
              <Route path="pricing" element={<Pricing />} />
              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="cities" />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountriesList />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="login" element={<Login />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
