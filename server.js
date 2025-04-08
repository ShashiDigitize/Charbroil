const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');


const app = express();

const PORT = process.env.PORT || 5000; //dev server

const { GoogleGenerativeAI } = require('@google/generative-ai');

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.get('/api/health', (req, res) => {
  res.status(200).send({ message: 'server healthy!' });
});


const grills = [
  {
      "Name": "3-burner",
      "Price": "$1,499.99",
      "Width (Inches)": "39.5",
      "Depth (Inches)": "26.5",
      "Height (Inches)": "47.5"
  },
  {
      "Name": "5-burner",
      "Price": "$1,349.99",
      "Width (Inches)": "41.5",
      "Depth (Inches)": "24.4",
      "Height (Inches)": "25.4"
  },
  {
      "Name": "Griddle",
      "Price": "$899.99",
      "Width (Inches)": "25",
      "Depth (Inches)": "26.5",
      "Height (Inches)": "38.1"
  },
  {
      "Name": "EnterianmentModule",
      "Price": "$1,599.99",
      "Width (Inches)": "50",
      "Depth (Inches)": "25",
      "Height (Inches)": "48.6"
  },
  {
      "Name": "KitchenCorner",
      "Price": "$599.99",
      "Width (Inches)": "38.3",
      "Depth (Inches)": "21.6",
      "Height (Inches)": "35.6"
  },
  {
      "Name": "StoveTop",
      "Price": "$899.99",
      "Width (Inches)": "25",
      "Depth (Inches)": "26.5",
      "Height (Inches)": "38.1"
  },
  {
      "Name": "Refrigerator",
      "Price": "$1,099.99",
      "Width (Inches)": "26.3",
      "Depth (Inches)": "25.3",
      "Height (Inches)": "35.6"
  },
  {
      "Name": "BarTop",
      "Price": "$379.99",
      "Width (Inches)": "50",
      "Depth (Inches)": "11",
      "Height (Inches)": "9.3"
  }
]

app.post('/api/getDimensions', async (req, res) => {
  try {
      const { width, height, location } = req.body;
      console.log('Width:', width, 'Height:', height,'Location:', location);

      const genAI = new GoogleGenerativeAI('AIzaSyBFtwIST4cK9vdNNGpSFCxL0XTAU3aGZXE');
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

      // Define the prompt for Gemini
      const prompt = `

        A customer says: '${location}'. Based on this inventory—${JSON.stringify(grills)}—
     recommend the most suitable fire grills. Consider factors like location, 
     weather suitability, and price where applicable. Provide a concise response 
    with the recommended grill(s) and a brief explanation.
    
          The user has an available space of ${width} cm wide and ${height} cm deep.
          Recommend a combination of multiple grills from the provided data that fits within this space.
          Consider the following:
          - The total width of the grills should not exceed ${width} cm.
          - The deepest grill should not exceed ${height} cm.
          - Optimize for variety (e.g., different types like gas, charcoal, electric) if possible.
          - Provide the total cost of the recommended grills.
          Return the response in JSON format with the following structure:
          {
              "recommended_grills": [
                  {
                      "grill_id": "string",
                      "type": "string",
                      "width_cm": number,
                      "depth_cm": number,
                      "price_usd": number
                  }
              ],
              "total_width_cm": number,
              "max_depth_cm": number,
              "total_cost_usd": number,
              "reasoning": "string"
          }
      `;

      // Call Gemini API
      console.log("prompt", prompt);
      const result = await model.generateContent(prompt);
      const recommendation = result.response.text();
      res.json({ recommendation });
      
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to get recommendation" });
  }
});
app.use(express.static(path.join(__dirname, 'build')));

app.listen(PORT, () => console.log('listening on port: ', PORT));
