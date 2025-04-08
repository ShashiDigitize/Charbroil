import React, { useEffect, useState } from 'react';
import { ThreekitProvider, useAttribute, Player } from '@threekit-tools/treble';
import { useWindowDimensions } from './widthsize';
import axios from 'axios';
import './Custom.css';
const Custom = () => {
  const { width, windowHeight } = useWindowDimensions();
  const [dimensionData, setDimensionData] = useState({});
  const [widthInput, setWidthInput] = useState('');
  const [heightInput, setHeightInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [showForm, setShowForm] = useState(true);

  const handleWidthChange = (e) => {
    setWidthInput(e.target.value);
  };

  const handleHeightChange = (e) => {
    setHeightInput(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocationInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        '/api/getDimensions',
        {
          width: widthInput,
          height: heightInput,
          location: locationInput,
        }
      );

      const jsonStringWithPrefix = response.data.recommendation.toString();

      const startIndex = jsonStringWithPrefix.indexOf('{');
      const endIndex = jsonStringWithPrefix.lastIndexOf('}');
      const jsonStringtoignore = jsonStringWithPrefix.slice(
        startIndex,
        endIndex + 1
      );
      const jsonString = JSON.parse(jsonStringtoignore);
      setDimensionData(jsonString);
      const obj = {};
      const cmpStr = 'Component ';
      jsonString.recommended_grills.forEach((item, i) => {
        obj[cmpStr + (i + 1)] = { customId: item.grill_id };
      });
      threekit.configurator.setConfiguration(obj);
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '70% 30%',
        height: '100vh',
      }}
    >
      <Player minHeight="548px" height={width > 1200 ? '548px' : '55vh'}>
        {window?.threekit?.player?.tools?.removeTool('pan')}
      </Player>
      <div>
        {showForm ? (
          <div className='form-container'><form onSubmit={handleSubmit} className="form">
            <label htmlFor="width-input">Width:</label>
            <input
              type="number"
              id="width-input"
              value={widthInput}
              onChange={handleWidthChange}
              placeholder="500"
              required
            />
            cm
            <br />
            <label htmlFor="height-input">Height:</label>
            <input
              type="number"
              id="height-input"
              value={heightInput}
              onChange={handleHeightChange}
              placeholder="200"
              required
            />
            cm
            <br />
            <label htmlFor="location-input">Location:</label>
            <input
              type="text"
              id="location-input"
              value={locationInput}
              onChange={handleLocationChange}
              placeholder="America"
              required
            />
            <br />
            <button type="submit">Submit</button>
          </form></div>
        ) : (
          <>
            {dimensionData && dimensionData.recommended_grills && (
              <div className="recommended-grills">
                <h2>Recommended Grills:</h2>
                <ul>
                  {dimensionData.recommended_grills.map((grill) => (
                    <li key={grill.grill_id}>
                      <p>Name: {grill.grill_id}</p>
                      <p>Type: {grill.type}</p>
                      <p>Width: {grill.width_cm} cm</p>
                      <p>Depth: {grill.depth_cm} cm</p>
                      <p>Price: ${grill.price_usd}</p>
                    </li>
                  ))}
                </ul>
                <p className="total-width">
                  Total Width: {dimensionData.total_width_cm} cm
                </p>
                <p className="max-depth">
                  Max Depth: {dimensionData.max_depth_cm} cm
                </p>
                <p className="total-cost">
                  Total Cost: ${dimensionData.total_cost_usd}
                </p>
                <p className="reasoning">
                  Reasoning: {dimensionData.reasoning}
                </p>
              </div>
            )}
          </>
        )}

        {/* dummy data starts*/}
        {/* <div className="recommended-grills">
      <h2>Recommended Grills:</h2>
      <ul>
       
<li>
<p>Name:bartop</p>
            <p>Type: Name:bartop</p>
            <p>Width: Name:bartop cm</p>
            <p>Depth: Name:bartop cm</p>
            <p>Price: Name:bartop</p></li>

            <li>
<p>Name:bartop</p>
            <p>Type: Name:bartop</p>
            <p>Width: Name:bartop cm</p>
            <p>Depth: Name:bartop cm</p>
            <p>Price: Name:bartop</p></li>
            <li>
<p>Name:bartop</p>
            <p>Type: Name:bartop</p>
            <p>Width: Name:bartop cm</p>
            <p>Depth: Name:bartop cm</p>
            <p>Price: Name:bartop</p></li>
            <li>
<p>Name:bartop</p>
            <p>Type: Name:bartop</p>
            <p>Width: Name:bartop cm</p>
            <p>Depth: Name:bartop cm</p>
            <p>Price: Name:bartop</p></li>
      </ul>
    
     <div style={{ borderTop: "2px solid red",margin:"20px 0" }}></div>

      <p className="total-width">Total Width: 4000 cm</p>
      <p className="max-depth">Total Width: 4000 cm</p>
      <p className="total-cost">Total Width: 4000 cm</p>
      <p className="reasoning">The user has an available space of 200 cm wide and 400 cm deep. Recommend a combination of multiple grills from the provided data that fits within this space. Consider the following:</p>
    </div> */}
        {/* dummy data ends*/}
      </div>
    </div>
  );
};

export default Custom;
