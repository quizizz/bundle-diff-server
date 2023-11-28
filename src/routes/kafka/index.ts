import KafkaResource from '@app/resources/kafka-resource';
import BaseController from '@app/controllers/base.controller';
import { ControllerFactory } from '@app/routes/handlers/handler.factory';
import {
  ExampleKafkaController,
  HealthController,
  MetaController,
} from '@app/controllers/meta.controller';
import components from '@app/components';
import { Router } from 'express';
import { injectable, inject } from 'inversify';

/** Kafka worker actions */
@injectable()
export class KafkaRoutes {
  /** Constructor */
  constructor(
    @inject(components.CONTROLLER_FACTORY)
    private factory: ControllerFactory,
    @inject(components.META_CONTROLLER) private metaController: MetaController,
    @inject(components.HEALTH_CONTROLLER)
    private healthController: HealthController,
    @inject(components.EXAMPLE_KAFKA_CONTROLLER)
    private exampleKafkaController: ExampleKafkaController,
    @inject(components.KAFKA) private kafka: KafkaResource,
  ) {}

  async registerTopic(topic: string, controller: BaseController<any>) {
    const execFn = this.factory.createKafkaController(controller);
    const consumer = await this.kafka.createConsumer(topic);
    consumer.listen(async (msg) => {
      await execFn(msg);
    });
  }

  async registerAllTopics() {
    const topicSubscribers: {
      topicName: string;
      controller: BaseController<any>;
    }[] = [];

    const promises = [
      topicSubscribers.map((topicSubscriber) =>
        this.registerTopic(
          topicSubscriber.topicName,
          topicSubscriber.controller,
        ),
      ),
    ];
    await Promise.all(promises);
  }

  /** V1 */
  v1() {
    return;
  }

  meta() {
    const router = Router();
    router.get('/ab', this.factory.createHttpController(this.metaController));
    router.get(
      '/health',
      this.factory.createHttpController(this.healthController),
    );
    return router;
  }

  initHTTPRoutes(): Router {
    const base = Router();
    base.use('/_meta/', this.meta());
    return base;
  }
}
