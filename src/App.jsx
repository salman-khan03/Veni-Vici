import { useState, useEffect } from 'react';
import './App.css';

const apiKey = 'live_pmUYbqSrZN5bbmVQGOXKmIjTjBVKE7ukEpeMjme3F9yDCCRcqrxeAkWWsrU2qMJC'; // Your API key here

function App() {
  const [data, setData] = useState(null);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=1&api_key=${apiKey}`);
      const result = await response.json();

      // Filter out results with banned attributes
      const filteredResult = result.filter(item => 
        !banList.some(ban => 
          Object.keys(ban).some(key => ban[key] === item.breeds?.[0]?.[key])
        )
      );

      if (data) {
        setHistory([...history, data]);
      }

      if (filteredResult.length > 0) {
        setData(filteredResult[0]);
      } else {
        setData(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleBan = (attribute) => {
    setBanList([...banList, attribute]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (banList.length > 0) {
      fetchData();
    }
  }, [banList]);

  return (
    <div className="App">
      <div className="whole-page">
        <h1>Discover New Things</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          data && (
            <div className="card">
              <img src={data.url} alt="Random Cat" />
              <h2>{data.breeds?.[0]?.name || "Unknown Breed"}</h2>
              <p>{data.breeds?.[0]?.origin || "Unknown Origin"}</p>
              <p>{data.breeds?.[0]?.temperament || "Unknown Temperament"}</p>
              <button onClick={() => handleBan({ name: data.breeds?.[0]?.name || "Unknown Breed", origin: data.breeds?.[0]?.origin || "Unknown Origin" })}>
                Ban {data.breeds?.[0]?.name}
              </button>
              <button onClick={fetchData}>Discover More</button>
            </div>
          )
        )}
        <div className="ban-list">
          <h3>Ban List</h3>
          <ul>
            {banList.map((item, index) => (
              <li key={index}>{item.name} ({item.origin})</li>
            ))}
          </ul>
        </div>
        <div className="history">
          <h3>Viewed History</h3>
          <ul>
            {history.map((item, index) => (
              <li key={index}>
                <img src={item.url} alt="History" width="50" />
                <span>{item.breeds?.[0]?.name || "Unknown Breed"}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
