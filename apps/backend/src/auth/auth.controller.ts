import { Body, Post, Route, Controller, Tags } from 'tsoa';
import { inject } from 'tsyringe';
import { registerController } from '../common/di.store';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { injectable } from 'tsyringe';

@Route('auth')
@Tags('Auth')
@injectable()
export class AuthController extends Controller {
  constructor(@inject(AuthService) private authService: AuthService) {
    super();
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}

registerController(AuthController);

