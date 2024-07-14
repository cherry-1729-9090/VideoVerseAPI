const express = require('express');
const videoRoutes = require('./src/routes/videoRoutes');

const app = express();

app.use(express.json());
app.use('/api/videos', videoRoutes);
app.post('/hi',(req,res)=>{
    res.send("Hello");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});