import {
  getMongoRepository,
  getRepository,
  MongoRepository,
  Repository,
} from "typeorm";
import { CacheEntity } from "../entities/cache.entity";

export class CacheRepository {
  repository: MongoRepository<CacheEntity>;
  constructor() {
    this.repository = getMongoRepository(CacheEntity);
  }
  async create(key: string, args: any, data: any): Promise<CacheEntity> {
    return await this.repository.save({ key, args, data });
  }

  async getByKey(key: string): Promise<CacheEntity | undefined> {
    let results = await this.repository.find({
      where: { key },
      order: { created_at: "DESC" },
      take: 1,
    });
    return results.length > 0 ? results[0] : null;
  }
}
