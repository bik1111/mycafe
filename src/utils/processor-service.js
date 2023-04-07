import amqp from "amqplib";



//RabbitMQ 채널 처리에서 요청 메시지를 수신하고 이전에 정의한 요청을 처리 한 후 결과를 채널 처리로 다시 보냅니다. 
// 이 데모의 목적을 위해 5 초 동안 기다렸다가 입력 문자열 끝에 ‘-processed’를 연결하여 
// heavy-processing 부분을 시뮬레이션합니다.


const messageQueueConnectionString =  'amqp://guest:guest@127.0.0.1:5672/';

async function listenForMessages() {
    // connect To RabbitMQ.
    let connection  = await amqp.connect(messageQueueConnectionString);

    let channel = await connection.createChannel();
    await channel.prefetch(1);

    //결과 전송할 채널 생성.
    let resultsChannel = await connection.createConfirmChannel();

    await consume({ connection, channel, resultsChannel });

}


// utility function to publish messages to a channel
function publishToChannel(channel, { routingKey, exchangeName, data}) {
    return new Promise ((resolve, reject) => {
        channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(data), 'utf-8') , { persistent : true}, function (err, ok ) {
            if(err) {
                return reject(err);
            }
            resolve();
        })
    })
}


// consume messages from RabbitMQ
function consume({ connection, channel, resultsChannel}) {
    return new Promise ((resolve, reject) => {
        channel.consume("processing.requests", async function (msg) {
            let msgBody = msg.content.toString();
            let data = JSON.parse(msgBody);
            let requestId = data.requestId;
            let requestData = data.requestData;
            console.log("Received a request message, requestId:", requestId);

            // process data
            let processingResults = await processMessage(requestData);

            // publish results to channel
            await publishToChannel(resultsChannel, {
            exchangeName: "processing",
            routingKey: "result",
            data: { requestId, processingResults }
      });
            console.log("Published results for requestId:", requestId);

            await channel.ack(msg);

        });

        connection.on("close", (err) => {
            return reject(err);
        })

        connection.on ("error", (err) => {
            return reject(err);
        })
    })
}

// simulate data processing that takes 5 seconds
function processMessage(requestData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(requestData + "-processed")
      }, 5000);
    });
  }

listenForMessages();
