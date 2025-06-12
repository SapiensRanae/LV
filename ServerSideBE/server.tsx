import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const app = express();
const port = 3001;

const swaggerDocument = YAML.load('./swagger.yaml');

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Example routes
app.post('/register', async (req, res) => {
    const { nickname, email, phone, password } = req.body;
    // TODO: Add validation and DB insert
    res.status(201).send({ message: 'User registered' });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // TODO: Verify credentials from DB
    res.status(200).send({ token: 'fake-jwt-token' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Swagger UI: http://localhost:${port}/api-docs`);
});
