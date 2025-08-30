"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";

const CountrySearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [countryInfo, setCountryInfo] = useState(null);
  const [error, setError] = useState("");
  const dropdownRef = useRef(null);

  const fetchCountryInfo = async (country) => {
    try {
      setError("");
      const response = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          format: "json",
          prop: "extracts|info",
          titles: country,
          exintro: true,
          explaintext: true,
          origin: "*",
        },
      });

      const pages = response.data.query.pages;
      const pageKey = Object.keys(pages)[0];

      if (pageKey === "-1") {
        setError("No data found for this country.");
        setCountryInfo(null);
      } else {
        setCountryInfo(pages[pageKey].extract);
      }
    } catch (err) {
      setError("Failed to fetch country data. Please try again.");
      setCountryInfo(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchCountryInfo(searchQuery);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCountryInfo(null);
        setError("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <input
          type="text"
          className="px-2 py-1 rounded border border-gray-300 text-sm"
          placeholder="Search country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          Go
        </button>
      </form>

      {(countryInfo || error) && (
        <div className="absolute top-full mt-1 bg-white text-black p-3 rounded shadow-lg z-10 w-72">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setCountryInfo(null);
                setError("");
              }}
              className="text-gray-500 hover:text-gray-800 font-bold"
            >
              ✖
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto pr-1">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {countryInfo && <p className="text-sm leading-relaxed">{countryInfo}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySearch;


