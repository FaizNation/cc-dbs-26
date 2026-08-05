require('dotenv').config();
const amqp = require('amqplib');
const MailSender = require('./MailSender');
const Listener = require('./Listener');

const init = async () => {
  const mailSender = new MailSender();
  const listener = new Listener(mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_HOST || 'amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertQueue('application:create', {
    durable: true,
  });

  channel.consume('application:create', listener.listen, { noAck: true });
  
  console.log('OpenJob Consumer is running and listening to "application:create" queue...');
};

init().catch(console.error);
