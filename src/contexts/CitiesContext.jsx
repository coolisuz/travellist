import { createContext, useState, useEffect, useContext } from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:9000";

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const result = await fetch(`${BASE_URL}/cities`);
        const data = await result.json();

        setCities(data);
      } catch (error) {
        alert("There was an erro loading data...");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const result = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await result.json();

      setCurrentCity(data);
      setIsLoading(false);
    } catch (error) {}
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        getCity,
        currentCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Cities context was used outside of the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
