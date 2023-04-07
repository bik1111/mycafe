const app = express();
import express from "express";
import bodyParser from "body-parser";
import amqp from "amqplib";

app.use(bodyParser.json());

//요청 아이디.
let lastRequestId = 1;

const messageQueueConnectionString =  'amqp://guest:guest@127.0.0.1:5672/';

app.post('/processData', async function(req,res) {
    //요청 아이디 저장 후 하나씩 늘려가기.
    let requestId = lastRequestId
    lastRequestId ++;

    // RabbitMQ 연결 후 채널 생성.
    let connection = await amqp.connect(messageQueueConnectionString);
    let channel = await connection.createConfirmChannel();

    // RabbitMQ에 데이터 전송.
    let requestData = req.body.data;
    console.log(" Published a request message, requestId: ", requestId);
    await publishToChannel(channel, { routingKey: "request", exchangeName: "processing", data: { requestId, requestData } });

    //응답으로 요청 아이디 전송.
    res.send({ requestId })

});


function publishToChannel(channel, {routingKey, exchangeName, data }) {
    return new Promise((resolve, reject) => {
        channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(data), 'utf-8'), { persistent : true}, function (err, ok) {
            if (err) {
                return reject(err);
            }
            resolve();
        })
    })
}


async function listenForResults() {
    // RabbitMQ와 연결.
    let connection = await amqp.connect(messageQueueConnectionString);

    // 채널과 연결 후 메시지 하나씩 듣기. 
    let channel = await connection.createChannel();
    await channel.prefetch(1);

    //메시지 cousume.
    await consume({ connection, channel });


}

function consume({ connection, channel, resultsChannel}) {
    return new Promise ((resolve, reject) => {
        channel.consume("processing.results", async function (msg) {
            //parse msg
            let msgBody = msg.content.toString();
            let data = JSON.parse(msgBody);
            let requestId = data.requestId;
            let processingResults = data.processingResults;
            console.log("Received a result message, requestId:", requestId, "processingResults:", processingResults);

            await channel.ack(msg);
        });

        // handle connection closed.
        connection.on("close" , (err) => {
            return reject(err);

        })

        //handle errors.
        connection.on("error", (err) => {
            return  reject(err);
        } )
    })

}


// Start the server
const PORT = 3000;
const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);


listenForResults();
