import { createContext, useEffect, useContext, useReducer } from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:9000";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case ActionsNames.LOADING:
      return { ...state, isLoading: true };

    case ActionsNames.CITY_LOADED:
      return { ...state, isLoading: false, currentCity: action.payload };

    case ActionsNames.CITIES_LOADED:
      return { ...state, isLoading: false, cities: action.payload };

    case ActionsNames.CITY_CREATED:
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case ActionsNames.CITY_DELETED:
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case ActionsNames.REJECTED:
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [{ isLoading, cities, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: ActionsNames.LOADING });
      try {
        const result = await fetch(`${BASE_URL}/cities`);
        const data = await result.json();

        dispatch({ type: ActionsNames.CITIES_LOADED, payload: data });
      } catch (error) {
        dispatch({
          type: ActionsNames.REJECTED,
          payload: "There was an erro loading cities...",
        });
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    if (Number(id) === currentCity.id) return;

    dispatch({ type: ActionsNames.LOADING });
    try {
      const result = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await result.json();

      dispatch({ type: ActionsNames.CITY_LOADED, payload: data });
    } catch (error) {
      dispatch({
        type: ActionsNames.REJECTED,
        payload: "There was an error fetching city...",
      });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: ActionsNames.LOADING });

    try {
      const result = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await result.json();

      dispatch({ type: ActionsNames.CITY_CREATED, payload: data });
    } catch (error) {
      dispatch({
        type: ActionsNames.REJECTED,
        payload: "There was an error creating city...",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: ActionsNames.LOADING });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: ActionsNames.CITY_DELETED, payload: id });
    } catch (error) {
      dispatch({
        type: ActionsNames.REJECTED,
        payload: "There was an error deleting city...",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        getCity,
        currentCity,
        createCity,
        deleteCity,
        error,
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

const ActionsNames = {
  LOADING: "loading",
  CITY_LOADED: "city/loaded",
  CITIES_LOADED: "cities/loaded",
  CITY_CREATED: "city/created",
  CITY_DELETED: "city/deleted",
  REJECTED: "rejected",
};
