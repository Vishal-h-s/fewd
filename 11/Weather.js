import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const WeatherApp = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [temperature, setTemperature] = useState(null);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const [isLoadingWeather, setIsLoadingWeather] = useState(false);
    const [error, setError] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const API_KEY = '0267549f8ecc4b58ba642116251803'; // Replace with your WeatherAPI key

    // Handle click outside dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch locations based on user input
    const fetchLocations = async (inputValue) => {
        if (!inputValue) {
            setSearchResults([]);
            return;
        }

        setIsLoadingResults(true);
        try {
            const response = await axios.get(
                `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${inputValue}`
            );

            // Process locations (cities, states, countries)
            const processedResults = response.data.map(item => {
                // Determine if it's a city, state, or country
                let type = 'city';
                let label = item.name;
                let value = item.name;
                
                if (item.country === item.name) {
                    type = 'country';
                    label = `${item.name} (Country)`;
                    value = item.name;
                } else if (item.region === item.name) {
                    type = 'state';
                    label = `${item.name}, ${item.country} (State)`;
                    value = `${item.name}, ${item.country}`;
                } else {
                    label = `${item.name}, ${item.region}, ${item.country}`;
                    value = item.name;
                }

                return {
                    type,
                    label,
                    value,
                    country: item.country,
                    region: item.region,
                    originalName: item.name
                };
            });

            setSearchResults(processedResults);
            setShowDropdown(true);
        } catch (error) {
            console.error('Error fetching locations:', error);
            setError('Failed to fetch locations');
            setSearchResults([]);
        } finally {
            setIsLoadingResults(false);
        }
    };

    // Fetch weather data for the selected location
    const fetchWeather = async (location) => {
        if (!location) return;

        setIsLoadingWeather(true);
        try {
            let queryParam;
            
            // Format query based on location type
            if (location.type === 'country') {
                queryParam = location.originalName;
            } else if (location.type === 'state') {
                queryParam = `${location.originalName}, ${location.country}`;
            } else {
                queryParam = `${location.originalName}, ${location.region}, ${location.country}`;
            }
            
            const response = await axios.get(
                `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${queryParam}`
            );

            setTemperature(response.data.current.temp_c);
            setError('');
        } catch (error) {
            console.error('Error fetching weather:', error);
            setError('Failed to fetch weather data');
            setTemperature(null);
        } finally {
            setIsLoadingWeather(false);
            // Keep the input value instead of clearing it
            // setInputValue('');
            setSelectedLocation(null);
            setShowDropdown(false);
        }
    };

    // Handle input change with debounce
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        
        // Clear any existing timeout
        if (window.fetchLocationsTimeout) {
            clearTimeout(window.fetchLocationsTimeout);
        }
        
        // Set a new timeout to fetch locations after 300ms of inactivity
        window.fetchLocationsTimeout = setTimeout(() => {
            fetchLocations(value);
        }, 300);
    };

    // Handle location selection and immediately fetch weather
    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setInputValue(location.label); // Set input to selected location
        fetchWeather(location); // Fetch weather immediately when location is selected
    };

    // Group search results by type
    const groupedResults = {
        cities: searchResults.filter(item => item.type === 'city'),
        states: searchResults.filter(item => item.type === 'state'),
        countries: searchResults.filter(item => item.type === 'country')
    };

    return (
        <div className="container p-4 mx-auto" style={{ maxWidth: '500px' }}>
            <h1 className="h3 mb-4 fw-bold">Weather App</h1>

            {/* Location Search Input with Bootstrap Dropdown */}
            <div className="mb-4 position-relative" ref={dropdownRef}>
                <label className="form-label fw-medium">Search for a City, State, or Country</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Delhi, Maharashtra, India..."
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => inputValue && searchResults.length > 0 && setShowDropdown(true)}
                />
                
                {/* Bootstrap Dropdown Menu with fixed width and text overflow handling */}
                {showDropdown && (
                    <ul className="dropdown-menu w-100 show" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {isLoadingResults ? (
                            <li className="dropdown-item text-muted">
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Loading results...
                            </li>
                        ) : searchResults.length > 0 ? (
                            <>
                                {/* Cities */}
                                {groupedResults.cities.length > 0 && (
                                    <>
                                        <li><h6 className="dropdown-header">Cities</h6></li>
                                        {groupedResults.cities.map((city, index) => (
                                            <li key={`city-${index}`}>
                                                <button 
                                                    className="dropdown-item text-truncate" 
                                                    type="button"
                                                    onClick={() => handleLocationSelect(city)}
                                                    title={city.label}
                                                    style={{ maxWidth: '100%' }}
                                                >
                                                    {city.label}
                                                </button>
                                            </li>
                                        ))}
                                    </>
                                )}
                                
                                {/* States */}
                                {groupedResults.states.length > 0 && (
                                    <>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><h6 className="dropdown-header">States</h6></li>
                                        {groupedResults.states.map((state, index) => (
                                            <li key={`state-${index}`}>
                                                <button 
                                                    className="dropdown-item text-truncate" 
                                                    type="button"
                                                    onClick={() => handleLocationSelect(state)}
                                                    title={state.label}
                                                    style={{ maxWidth: '100%' }}
                                                >
                                                    {state.label}
                                                </button>
                                            </li>
                                        ))}
                                    </>
                                )}
                                
                                {/* Countries */}
                                {groupedResults.countries.length > 0 && (
                                    <>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><h6 className="dropdown-header">Countries</h6></li>
                                        {groupedResults.countries.map((country, index) => (
                                            <li key={`country-${index}`}>
                                                <button 
                                                    className="dropdown-item text-truncate" 
                                                    type="button"
                                                    onClick={() => handleLocationSelect(country)}
                                                    title={country.label}
                                                    style={{ maxWidth: '100%' }}
                                                >
                                                    {country.label}
                                                </button>
                                            </li>
                                        ))}
                                    </>
                                )}
                            </>
                        ) : (
                            <li className="dropdown-item text-muted">No results found</li>
                        )}
                    </ul>
                )}
            </div>

            {/* Display Weather Data */}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            
            {/* Loading indicator for weather */}
            {isLoadingWeather && (
                <div className="text-center mt-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            
            {/* Temperature display (only shows the number) */}
            {temperature !== null && !isLoadingWeather && (
                <div className="mt-4 text-center">
                    <h2 className="display-1">{temperature}°C</h2>
                </div>
            )}
        </div>
    );
};

export default WeatherApp;