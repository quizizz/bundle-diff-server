import * as _ from 'lodash';
import Resource from './resource';
import Config from '@app/config';
import components from '@app/components';
import { logger } from '@app/core/logger';
import {
  getKafkaConsumer,
  getKafkaProducer,
  KafkaConsumer,
  KafkaProducer,
} from '@quizizz/kafka';
import { injectable, inject } from 'inversify';
import Emitter from '@app/core/emitter';
import { Request, Response } from '@app/domains/app';

interface TopicConfig {
  groupId?: string;
}

@injectable()
export default class KafkaResource implements Resource {
  private producer!: KafkaProducer;
  private consumer!: KafkaConsumer;
  private clientId!: string;
  private groupId!: string;
  private brokers!: string[];
  private topicConfigs!: Record<string, TopicConfig>;
  private name = 'kafka';
  private topicControllerMapping = {};

  constructor(
    @inject(components.CONFIG) private config: Config,
    @inject(components.EMITTER) private emitter: Emitter,
  ) {}

  async load() {
    const { groupId, brokers, topics } = this.config.kafka;
    if (groupId) {
      this.groupId = groupId;
    }

    if (topics) {
      this.topicConfigs = topics;
    }

    this.clientId = `${this.groupId}_${this.config.id}`;
    this.brokers = brokers;
    this.producer = getKafkaProducer(
      this.clientId,
      {
        'metadata.broker.list': brokers.join(','),
      },
      {},
      this.emitter.getEmitter(),
    );
    await this.producer.connect();
    logger.info('Kafka producer connected successfully');

    process.on('SIGTERM', () => {
      // flush the messages in kafka-client internal buffer to kafka-cluster, so
      // that messages are not lost.
      this.producer.flush(5000, (err) => {
        logger.error(
          'Encountered error while flushing messages from kafka-client buffer to kafka cluster. %j',
          err,
        );
      });
    });
  }

  getProducer(): KafkaProducer {
    return this.producer;
  }

  async createConsumer(topic: string) {
    const groupId =
      _.get(this.topicConfigs, `${topic}.groupId`, null) ||
      `${this.clientId}_${topic}`;

    const consumer = getKafkaConsumer(
      this.clientId,
      groupId,
      {
        'metadata.broker.list': this.brokers.join(','),
      },
      {},
      this.emitter.getEmitter(),
    );
    logger.info('subscribed to kafka topic %s as %s', topic, groupId);
    await consumer.connect();
    consumer.subscribe([topic]);
    return consumer;
  }

  mapTopicToController(
    topic: string,
    exec: (
      req?: Request<unknown, unknown, unknown>,
    ) => void | Promise<Response<unknown>>,
  ) {
    this.topicControllerMapping[topic] = exec;
  }

  subscribe() {
    this.consumer.subscribe(Object.keys(this.topicControllerMapping));
  }
}
