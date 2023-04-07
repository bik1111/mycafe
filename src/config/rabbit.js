import amqp from "amqplib";


// RabbitMQ 대기열 구성.
// RabbitMQ 인스턴스 생성.
// 큐 설정.

const messageQueueConnectionString = 'amqp://guest:guest@127.0.0.1:5672/';

async function setup() {
    console.log(' Setting up RabbitMQ Exchanges/Queues ')

    let connection = await amqp.connect(messageQueueConnectionString);

    let channel = await connection.createChannel();

    // create exchange (exchange "processing" 선언)
    await channel.assertExchange('processing', 'direct', { durable : true });

    // create queues
    // 2 개의 queues 선언 : “processing.requests”는 요청을 저장하고 “processing.results”는 결과를 저장합니다.
    await channel.assertQueue("processing.requests", { durable: true });
    await channel.assertQueue("processing.results", { durable: true });

    // bind queues
    // queues를 exchange에 바인딩
    // WebService가 processing.requests 대기열로 요청을 보내고 
    // ProcessorService는 거기에서 요청을 읽고 WebService가 액세스 할 수있는 
    // processing.results에 결과를 게시한다는 것입니다.
    // webService -> (요청) : processing.requests -> (요청 읽음) : processingService -> (결과 게시) : processing.results
    

    await channel.bindQueue('processing.requests', 'processing', 'request')
    await channel.bindQueue('processing.results', 'processing', 'result')

    console.log('Setup DONE')
    process.exit();


}

setup();