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
    // durable를 true로 설정하며 네트워크가 끊긴 상태에서 메시지가 보내지더라도 큐에 저장하고 있다가 연결되면 재전송 가능.
    await channel.assertQueue("processing.requests", { durable: true });
    await channel.assertQueue("processing.results", { durable: true });

    // bind queues
    // queues를 exchange에 바인딩
    // WebService가 processing.requests 대기열로 요청을 보내고 
    // ProcessorService는 거기에서 요청을 읽고 WebService가 액세스 할 수있는 
    // processing.results에 결과를 게시한다는 것입니다.
    // webService -> (요청) : processing.requests -> (요청 읽음) : processingService -> (결과 게시) : processing.results
    

    //exchange 와 queue를 바인딩 ( 하나의 채널 )
    // 특정 Exchange가 특정 queue에 바인딩
    // 여기서는 processing이라는 exchange가 request,results 큐에 모두다 바인딩 됨.
    // exchnage는 메시지를 가장 먼저 수신하는, 우체국 같은 곳임 
    // 그리고 큐는 소포를 받을 개인들. 
    // 세번째 인자는 라우팅key임.
    // 라우팅 키를 이용해 exchange에게 어느 큐에게 보내야 할지 알려줄 수 있음.
    await channel.bindQueue('processing.requests', 'processing', 'request')
    await channel.bindQueue('processing.results', 'processing', 'result')

    console.log('Setup DONE')
    process.exit();


}

setup();