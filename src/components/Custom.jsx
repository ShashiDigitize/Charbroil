import React, { useEffect, useState } from 'react';
import { ThreekitProvider, useAttribute, Player } from '@threekit-tools/treble';
import { useWindowDimensions } from './widthsize';
import axios from 'axios';
import Cards from './Cards.jsx';

const Custom = () => {
  const { width, windowHeight } = useWindowDimensions();
  const [dimensionData, setDimensionData] = useState({});
  const [widthInput, setWidthInput] = useState('');
  const [heightInput, setHeightInput] = useState('');

  const handleWidthChange = (e) => {
      setWidthInput(e.target.value);
  };

  const handleHeightChange = (e) => {
      setHeightInput(e.target.value);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.post(
              'http://localhost:5000/api/getDimensions',
              {
                  width: widthInput,
                  height: heightInput,
              }
          );
        
          console.log('response>>>>>>>>>>>>>>>', response)
          const jsonString = response.data.recommendation;
          console.log("jsonString>>>>>>>>>>>>>", jsonString);
          const jsonStringWithPrefix = jsonString.toString();
          console.log('Response:', jsonStringWithPrefix);
          


          const startIndex = jsonStringWithPrefix.indexOf('{');
          console.log('startIndex>>>>>>>>>>>>>>>', startIndex)
          const endIndex = jsonStringWithPrefix.lastIndexOf('}');
          console.log('endIndex>>>>>>>>>>>>>>>', endIndex)
          const jsonString2 = jsonStringWithPrefix.slice(startIndex, endIndex + 1);
          console.log("jsonString2>>>>>>>>>>>>>", jsonString2)
          const jsonString3 = JSON.parse(jsonString2)
          console.log('jsonString3>>>>>>>>>>>>>>>>>', jsonString3)



          setDimensionData(jsonString3);


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
              <form onSubmit={handleSubmit}>
                  <label htmlFor="width-input">Width:</label>
                  <input
                      type="number"
                      id="width-input"
                      value={widthInput}
                      onChange={handleWidthChange}
                      placeholder="50"
                      required
                  />
                  <br />
                  <label htmlFor="height-input">Height:</label>
                  <input
                      type="number"
                      id="height-input"
                      value={heightInput}
                      onChange={handleHeightChange}
                      placeholder="20"
                      required
                  />
                  <br />
                  <button type="submit">Submit</button>
              </form>
              {dimensionData && (
                  <div>
                      <h2>Recommended Grills:</h2>
                      <ul>
                          {dimensionData.recommended_grills &&
                              dimensionData.recommended_grills.map((grill) => (
                                  <li key={grill.grill_id}>
                                      <p>Type: {grill.type}</p>
                                      <p>Width: {grill.width_cm} cm</p>
                                      <p>Depth: {grill.depth_cm} cm</p>
                                      <p>Price: ${grill.price_usd}</p>
                                  </li>
                              ))}
                      </ul>
                      <p>Total Width: {dimensionData.total_width_cm} cm</p>
                      <p>Max Depth: {dimensionData.max_depth_cm} cm</p>
                      <p>Total Cost: ${dimensionData.total_cost_usd}</p>
                      <p>Reasoning: {dimensionData.reasoning}</p>
                  </div>
              )}
          </div>
      </div>
  );
};

export default Custom;
