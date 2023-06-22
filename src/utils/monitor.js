import client from "prom-client";
import express from "express";

const app = express();


export const restResponseTimeHistogram = new client.Histogram({
  name : 'rest_response_time_duration_seconds', 
  help : 'REST API response time in seconds',
  labelNames : ['method', 'route', 'status_code']
})

export const databaseResponseTimeHistogram = new client.Histogram({
  name : 'db_response_time_duration_seconds', 
  help : 'Database response time in seconds',
  labelNames : ['operation', 'success']
})

export const startMetricServer = (req,res) => {
  try {
  const collectDefaultMetrics = client.collectDefaultMetrics;

  collectDefaultMetrics();

  app.get('/metrics', async() => {
    res.set("Content-Type", client.register.contentType)
    return res.send(await client.register.metrics())
  })

  app.listen(9100, () => {
    console.log('Metrics server started at http://localhost:3001')
  })
} catch(err){
  console.log(err);

}
}

