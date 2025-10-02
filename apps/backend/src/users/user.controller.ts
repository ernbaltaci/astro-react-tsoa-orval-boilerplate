import { Get, Route, Controller, Tags, Security, Request } from 'tsoa';
import { inject } from 'tsyringe';
import { registerController } from '../common/di.store';
import { injectable } from 'tsyringe';
import { UserService } from './user.service';
import { UserNotFoundError } from '../auth/auth.error';

@Route('user')
@Tags('User')
@injectable()
export class UserController extends Controller {
  constructor(@inject(UserService) private userService: UserService) {
    super();
  }

  @Get('@me')
  @Security('jwt')
  async me(@Request() req: Request) {
    const userId = req?.payload?.id;

    const user = await this.userService.getById(userId);

    if (!user) {
      throw new UserNotFoundError('User not found');
    }

    return user;
  }
}

registerController(UserController);

