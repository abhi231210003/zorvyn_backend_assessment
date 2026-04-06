const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const routes = require("./routes");
const openApiSpec = require("./docs/openapi");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/docs.json", (req, res) => {
	res.status(200).json(openApiSpec);
});

app.use(
	"/api/docs",
	swaggerUi.serve,
	swaggerUi.setup(openApiSpec, {
		explorer: true,
		customSiteTitle: "Finance Backend API Docs",
	})
);

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
