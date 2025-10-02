import { injectable, inject } from 'tsyringe';
import { DatabaseService } from '../database/database.service';
import { registerService } from '../common/di.store';

@injectable()
export class UserService {
  constructor(@inject(DatabaseService) private db: DatabaseService) {}

  async getById(id: string) {
    const user = await this.db.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
      },
    });
    if (!user || user.isDeleted) return null;
    return user;
  }

  async getByIdOrNull(id: string) {
    const user = await this.db.prisma.user.findUnique({
      where: { id },
    });
    if (!user || user.isDeleted) return null;
    return user;
  }
}

registerService(UserService);

