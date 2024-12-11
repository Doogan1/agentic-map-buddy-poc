const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/update-map', (req, res) => {
  const { fieldName, fieldValue } = req.body;
  
  if (!fieldName || !fieldValue) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  
  res.json({
    success: true,
    data: {
      fieldName,
      fieldValue
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});